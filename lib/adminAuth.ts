import { NextRequest } from "next/server";

export function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return false;

  const token = authHeader.split(" ")[1];

  // 🔥 SIMPLE CHECK (upgrade later with JWT)
  if (token !== process.env.ADMIN_SECRET) {
    return false;
  }

  return true;
}