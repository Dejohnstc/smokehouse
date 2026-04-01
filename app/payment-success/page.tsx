"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  useEffect(() => {
    if (reference) {
      // 🔥 OPTIONAL: verify payment later
      console.log("Payment reference:", reference);
    }
  }, [reference]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>

      <p className="text-gray-600 mb-4">
        Thank you for your purchase!
      </p>

      <p className="text-sm text-gray-400 mb-6">
        Reference: {reference}
      </p>

<Link
  href="/"
  className="bg-black text-white px-6 py-3 rounded-xl"
>
  Continue Shopping
</Link>
    </div>
  );
}