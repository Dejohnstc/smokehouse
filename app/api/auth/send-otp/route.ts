import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { Resend } from "resend";

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

    // ✅ INIT RESEND
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      throw new Error("❌ RESEND_API_KEY missing");
    }

    const resend = new Resend(RESEND_API_KEY);

    // ✅ PREMIUM EMAIL TEMPLATE
    await resend.emails.send({
      from: "Nature Smokehouse <noreply@obiresoffice.com>",
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 10px; text-align: center;">
            
            <h2 style="color: #111;">Verify Your Account</h2>
            
            <p style="color: #555; font-size: 14px;">
              Use the code below to continue. This code will expire in 10 minutes.
            </p>

            <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 20px 0; color: #16a34a;">
              ${otp}
            </div>

            <p style="color: #777; font-size: 12px;">
              If you didn’t request this, you can safely ignore this email.
            </p>

            <hr style="margin: 20px 0;" />

            <p style="font-size: 12px; color: #999;">
              Nature Smokehouse • Secure Authentication
            </p>

          </div>
        </div>
      `,
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