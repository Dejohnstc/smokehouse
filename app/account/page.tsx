"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // 🔒 PROTECT PAGE
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // ⏳ PREVENT HYDRATION CRASH
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading account...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8">
        My Account
      </h1>

      {/* CARD */}
      <div className="bg-white/80 backdrop-blur border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">

        {/* USER INFO */}
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-semibold text-lg">
            {user?.email || "N/A"} {/* ✅ SAFE */}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">

          <button
            onClick={() => router.push("/orders")}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            View Orders
          </button>

          <button
            onClick={logout}
            className="w-full border py-3 rounded-xl text-red-500"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}