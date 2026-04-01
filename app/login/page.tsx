"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    setStep(2);
  };

  const verifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Login successful");
      window.location.href = "/";
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {step === 1 ? (
        <>
          <h1 className="text-xl mb-4">Enter Email</h1>

          <input
            className="w-full border p-2 mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={sendOtp}
            className="w-full bg-black text-white py-2"
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <h1 className="text-xl mb-4">Enter OTP</h1>

          <input
            className="w-full border p-2 mb-3"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOtp}
            className="w-full bg-black text-white py-2"
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}