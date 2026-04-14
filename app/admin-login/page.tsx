"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const login = async () => {
    if (!email || !password) {
      return alert("Enter email and password");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ SAVE ADMIN TOKEN
        localStorage.setItem("admin_token", data.token);

        router.push("/admin");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border space-y-5">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center">
          Admin Panel Login
        </h1>
        <p className="text-center text-gray-500 text-sm">
          Restricted access
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Admin email"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SECURITY NOTE */}
        <p className="text-xs text-gray-400 text-center">
          🔒 Authorized personnel only
        </p>
      </div>
    </div>
  );
}