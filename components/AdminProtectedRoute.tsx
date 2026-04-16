"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  useEffect(() => {
    if (!token) {
      router.push("/admin");
    }
  }, [token, router]);

  // 🔥 block render if no token
  if (!token) return null;

  return <>{children}</>;
}