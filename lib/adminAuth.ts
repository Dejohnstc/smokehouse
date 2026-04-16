import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type AdminPayload = {
  email: string;
};

export function verifyAdmin(req: NextRequest): AdminPayload | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AdminPayload;

    return decoded;
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error);
    return null;
  }
}