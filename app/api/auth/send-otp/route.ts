import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email required" },
        { status: 400 }
      );
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    // ✅ SEND EMAIL (RESEND)
    await resend.emails.send({
      from: "onboarding@resend.dev", // change later
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });

    return NextResponse.json({ message: "OTP sent" });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}