"use client";

import { useState, useEffect, useRef } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""));
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // ⏳ COUNTDOWN
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const sendOtp = async () => {
    if (!email) return alert("Enter your email");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send OTP");
        return;
      }

      setStep(2);
      setCountdown(60);

      // 🔥 focus first box
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        alert("Invalid OTP");
        setOtpArray(Array(6).fill(""));
        inputsRef.current[0]?.focus();
      }
    } catch {
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 HANDLE INPUT
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    // 👉 move forward
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // 🚀 auto submit
    if (newOtp.join("").length === 6) {
      verifyOtp(newOtp.join(""));
    }
  };

  // 🔥 HANDLE BACKSPACE
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border">

        <h1 className="text-2xl font-bold text-center mb-2">
          Welcome to Nature Smokehouse
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Secure login with email verification
        </p>

        {step === 1 ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            {/* 🔢 OTP BOXES */}
            <div className="flex justify-between mb-6">
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {inputsRef.current[index] = el;}}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              ))}
            </div>

            {/* LOADING */}
            {loading && (
              <p className="text-sm text-gray-500 text-center mb-2">
                Verifying...
              </p>
            )}

            {/* RESEND */}
            <button
              onClick={sendOtp}
              disabled={countdown > 0 || loading}
              className="w-full text-sm text-gray-500 disabled:opacity-50"
            >
              {countdown > 0
                ? `Resend OTP in ${countdown}s`
                : "Resend OTP"}
            </button>

            {/* BACK */}
            <button
              onClick={() => setStep(1)}
              className="w-full mt-2 text-xs text-gray-400"
            >
              Change email
            </button>
          </>
        )}

        <div className="mt-6 text-xs text-gray-400 text-center">
          🔒 Secure authentication • No passwords required
        </div>
      </div>
    </div>
  );
}