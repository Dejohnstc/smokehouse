"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (reference) {
      console.log("Payment reference:", reference);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>

      <p className="text-gray-600 mb-6">
        Thank you for your order. Your payment has been received.
      </p>

      <Link
        href="/"
        className="bg-black text-white px-6 py-2 rounded-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}