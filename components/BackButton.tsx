"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // ❌ HIDE ON DASHBOARD
  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur border px-4 py-2 rounded-xl shadow hover:shadow-md transition text-sm"
    >
      ← Back
    </button>
  );
}