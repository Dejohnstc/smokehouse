"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // 🔥 SIMPLE ADMIN CHECK
    if (user.email !== "youradmin@email.com") {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return null;

  return <>{children}</>;
}