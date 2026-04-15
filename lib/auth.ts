// lib/auth.ts
import jwt from "jsonwebtoken";

export type AuthUser = {
  id: string;
  email: string;
};

export function getUserFromRequest(req: Request): AuthUser | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthUser; // ✅ TYPE SAFE
  } catch {
    return null;
  }
}