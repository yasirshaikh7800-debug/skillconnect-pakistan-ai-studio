// Server-side in-memory store for Next.js API route fallback
export interface OtpSession {
  phone: string;
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

// Global reference across hot reloads or route invocations
const globalForOtp = global as unknown as { otpStore?: Map<string, OtpSession> };

export const otpStore = globalForOtp.otpStore || new Map<string, OtpSession>();

if (process.env.NODE_ENV !== 'production') {
  globalForOtp.otpStore = otpStore;
}
