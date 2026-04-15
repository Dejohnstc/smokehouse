"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition text-sm font-medium"
      >
        ← Back
      </button>
    </div>
  );
}