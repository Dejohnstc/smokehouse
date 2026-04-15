import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

type VerifyRequest = {
  email: string;
  otp: string;
};

export async function POST(req: Request) {
  try {
    await connectDB();

    const body: VerifyRequest = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // ❌ USER NOT FOUND
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // ❌ INVALID OTP
    if (!user.otp || user.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // ❌ EXPIRED OTP
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 400 }
      );
    }

    // 🔐 USE ENV SECRET
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET missing");
    }

    // ✅ GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🧹 CLEAR OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json({ token });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}