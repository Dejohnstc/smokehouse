type RateRecord = {
  count: number;
  lastRequest: number;
};

const otpStore = new Map<string, RateRecord>();

const WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;
const COOLDOWN = 60 * 1000; // 60 seconds

export function checkOtpRateLimit(identifier: string) {
  const now = Date.now();

  const record = otpStore.get(identifier);

  // ✅ FIRST REQUEST
  if (!record) {
    otpStore.set(identifier, { count: 1, lastRequest: now });
    return { allowed: true };
  }

  // ⏱ COOLDOWN CHECK
  if (now - record.lastRequest < COOLDOWN) {
    return {
      allowed: false,
      message: "Please wait before requesting another OTP",
    };
  }

  // 🔄 RESET WINDOW
  if (now - record.lastRequest > WINDOW) {
    otpStore.set(identifier, { count: 1, lastRequest: now });
    return { allowed: true };
  }

  // 🚫 MAX LIMIT
  if (record.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      message: "Too many OTP requests. Try again later.",
    };
  }

  // ✅ ALLOW
  record.count += 1;
  record.lastRequest = now;
  otpStore.set(identifier, record);

  return { allowed: true };
}