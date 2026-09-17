const fs = require('fs');

const verifyPath = 'apps/frontend/src/app/api/auth/otp/verify/route.ts';
let verifyContent = `import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = (body.phone || '').trim();
    const code = (body.code || '').trim();

    if (!phone || !code) {
      return NextResponse.json(
        { message: 'Phone and verification code are required' },
        { status: 400 }
      );
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_DEV_OTP === 'true') {
      // Accept universal test codes for development/testing ONLY
      if (code === '0000' || code === '8372') {
        otpStore.delete(phone);
        return NextResponse.json({
          success: true,
          message: 'Phone number verified successfully (DEV MOCK)',
          phone,
        });
      }
    }

    // Proxy to NestJS backend
    try {
      const res = await fetch(\`\${BACKEND_URL}/api/v1/auth/otp/verify\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      if (res.ok) {
        return NextResponse.json(data);
      } else {
        return NextResponse.json(data, { status: res.status });
      }
    } catch (err: any) {
      return NextResponse.json(
        { message: 'Backend service unavailable. Please configure external database and backend.' },
        { status: 503 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
`;
fs.writeFileSync(verifyPath, verifyContent);

const sendPath = 'apps/frontend/src/app/api/auth/otp/send/route.ts';
let sendContent = `import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = (body.phone || '').trim();

    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { message: 'Valid phone number is required' },
        { status: 400 }
      );
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_DEV_OTP === 'true') {
      const now = Date.now();
      otpStore.set(phone, {
        phone,
        code: '0000',
        expiresAt: now + 5 * 60 * 1000,
        attempts: 0,
        lastSentAt: now,
      });
      return NextResponse.json({
        success: true,
        message: 'OTP sent (DEV MOCK)',
        phone,
        expiresInSeconds: 300,
        resendAvailableInSeconds: 60,
      });
    }

    // Proxy to NestJS backend
    try {
      const res = await fetch(\`\${BACKEND_URL}/api/v1/auth/otp/send\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      if (res.ok) {
        return NextResponse.json(data);
      } else {
        return NextResponse.json(data, { status: res.status });
      }
    } catch (err: any) {
      return NextResponse.json(
        { message: 'Backend service unavailable. Please configure external database and backend.' },
        { status: 503 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
`;
fs.writeFileSync(sendPath, sendContent);
