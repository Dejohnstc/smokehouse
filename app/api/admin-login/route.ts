import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = signAdminToken({ email });

    return NextResponse.json({ token });
  }

  return NextResponse.json(
    { message: "Invalid credentials" },
    { status: 401 }
  );
}