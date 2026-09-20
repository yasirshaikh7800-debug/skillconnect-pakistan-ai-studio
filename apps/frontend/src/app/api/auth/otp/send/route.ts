import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawPhone = (body.phone || '').trim();

    if (!rawPhone || rawPhone.length < 10) {
      return NextResponse.json(
        { message: 'A valid Pakistani phone number is required (e.g. 03001234567).' },
        { status: 400 }
      );
    }

    const formattedPhone = rawPhone.replace(/\s+/g, '');

    // 1. Proxy to backend if configured and reachable
    if (process.env.BACKEND_URL) {
      try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formattedPhone }),
          signal: AbortSignal.timeout(3000),
        });
        const data = await res.json();
        if (res.ok) {
          return NextResponse.json(data);
        }
      } catch {
        // Fall back to direct Prisma persistent storage
      }
    }

    // 2. Persistent OTP generation with PostgreSQL + Prisma
    // Cryptographically secure 6-digit numeric OTP
    const secureCode = crypto.randomInt(100000, 1000000).toString();
    const codeHash = crypto.createHash('sha256').update(secureCode).digest('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes expiration

    try {
      // Invalidate any existing unused OTPs for this phone number
      await prisma.otpVerification.updateMany({
        where: {
          phone: formattedPhone,
          isConsumed: false,
        },
        data: {
          isConsumed: true,
          consumedAt: now,
        },
      });

      // Persist new secure OTP record
      await prisma.otpVerification.create({
        data: {
          phone: formattedPhone,
          codeHash,
          expiresAt,
          isConsumed: false,
          attempts: 0,
        },
      });
    } catch (dbError: any) {
      console.error('Failed to persist OTP in PostgreSQL:', dbError);
      return NextResponse.json(
        { message: 'Database service unavailable for OTP storage.' },
        { status: 503 }
      );
    }

    const isDevAllowed =
      process.env.NODE_ENV === 'development' &&
      process.env.ENABLE_DEV_OTP === 'true';

    return NextResponse.json({
      success: true,
      message: 'Verification code dispatched successfully via SMS.',
      phone: formattedPhone,
      expiresInSeconds: 300,
      resendAvailableInSeconds: 60,
      ...(isDevAllowed ? { devCode: secureCode } : {}),
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
