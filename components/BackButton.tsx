"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <>
      {/* 🔥 SAFE SPACING (prevents overlap globally) */}
      <div className="h-16" />

      {/* 🔥 BUTTON */}
      <div className="fixed top-3 left-3 z-40">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-gray-200 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition text-sm font-medium"
        >
          ← Back
        </button>
      </div>
    </>
  );
}