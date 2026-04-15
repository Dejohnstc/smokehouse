import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// ✅ SIGN TOKEN
export function signAdminToken(payload: { email: string }) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d", // ⏱ 1 day
  });
}

// ✅ VERIFY TOKEN
export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}