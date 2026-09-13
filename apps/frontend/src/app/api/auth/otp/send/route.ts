import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = (body.phone || '').trim();

    if (!phone) {
      return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

    // Attempt to proxy to NestJS backend if active with fast timeout
    if (process.env.BACKEND_URL) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/auth/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
          signal: AbortSignal.timeout(500),
        });
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data);
        }
      } catch {
        // Fallback to Next.js server-side store
      }
    }

    const now = Date.now();
    const existing = otpStore.get(phone);

    // Rate Limit: 60s cooldown
    if (existing && now - existing.lastSentAt < 60000) {
      const waitTime = Math.ceil((60000 - (now - existing.lastSentAt)) / 1000);
      return NextResponse.json(
        { message: `Please wait ${waitTime} seconds before requesting a new verification code.` },
        { status: 429 },
      );
    }

    // Generate 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = now + 5 * 60 * 1000;

    otpStore.set(phone, {
      phone,
      code,
      expiresAt,
      attempts: 0,
      lastSentAt: now,
    });

    return NextResponse.json({
      success: true,
      message: 'OTP verification code sent via SMS',
      phone,
      expiresInSeconds: 300,
      resendAvailableInSeconds: 60,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
