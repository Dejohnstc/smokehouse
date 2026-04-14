"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const router = useRouter();

  const sendOtp = async () => {
    if (!email) return alert("Enter your email");

    setLoading(true);

    try {
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setStep(2);
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

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
        // ✅ Save token
        localStorage.setItem("token", data.token);

        // ✅ Decode token + update context
        try {
          const payload = JSON.parse(atob(data.token.split(".")[1]));

          setUser({
            id: payload.id,
            email: payload.email,
          });
        } catch (err) {
          console.error("Token decode failed");
        }

        // ✅ Smooth redirect
        router.push("/");
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border">
        
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center mb-2">
          Welcome to Nature Smokehouse
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Secure login with email verification
        </p>

        {step === 1 ? (
          <>
            {/* EMAIL INPUT */}
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* BUTTON */}
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
            {/* OTP INPUT */}
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border rounded-lg p-3 mb-4 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {/* VERIFY BUTTON */}
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* BACK */}
            <button
              onClick={() => setStep(1)}
              className="w-full mt-3 text-sm text-gray-500 hover:underline"
            >
              Change email
            </button>
          </>
        )}

        {/* TRUST */}
        <div className="mt-6 text-xs text-gray-400 text-center space-y-1">
          <p>🔒 Secure authentication</p>
          <p>No passwords required</p>
        </div>
      </div>
    </div>
  );
}