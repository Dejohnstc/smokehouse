import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("Admin env not set");
    }

    if (
      email.trim() === adminEmail.trim() &&
      password.trim() === adminPassword.trim()
    ) {
      const token = signAdminToken({ email });

      return NextResponse.json({ token });
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}