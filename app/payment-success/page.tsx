"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const reference = searchParams.get("reference");

  const [status, setStatus] = useState("Verifying payment...");
  const [order, setOrder] = useState<Order | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // ✅ VERIFY PAYMENT (SAFE — RUNS ONLY ONCE)
  useEffect(() => {
    if (!reference) return;

    const alreadyProcessed = sessionStorage.getItem(reference);

    // 🔥 PREVENT RE-RUN
   if (alreadyProcessed) {
  setTimeout(() => {
    setStatus("Payment already verified ✅");
    setCountdown(10);
  }, 0);
  return;
}

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("Payment successful 🎉");
          setOrder(data);

          clearCart();

          // 🔥 MARK AS PROCESSED
          sessionStorage.setItem(reference, "done");

          setCountdown(10); // 🔥 increased from 5 → 10
        } else {
          setStatus("Payment verification failed");
        }
      } catch {
        setStatus("Something went wrong");
      }
    };

    verifyPayment();
  }, [reference, clearCart]);

  // ⏳ COUNTDOWN
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  // ✅ WHATSAPP
  const phone = "2348078417869";

  const message = order
    ? encodeURIComponent(`
🛒 New Order

Order ID: ${order._id}

Items:
${order.items
  .map((i) => `- ${i.name} x${i.quantity}`)
  .join("\n")}

Total: ₦${order.totalAmount}

Please confirm my order. Thank you!
`)
    : "";

  const whatsappLink = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">

      <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
        {status}
      </h1>

      {/* ⏳ COUNTDOWN */}
      {countdown !== null && (
        <p className="text-gray-500 mb-4">
          Redirecting to dashboard in{" "}
          <span className="font-semibold">{countdown}</span>s...
        </p>
      )}

      {/* ✅ WHATSAPP */}
      {order && (
        <a
          href={whatsappLink}
          target="_blank"
          className="bg-green-600 text-white px-6 py-3 rounded-lg mt-2"
        >
          Chat on WhatsApp
        </a>
      )}

      {/* 🎯 BUTTONS */}
      <div className="flex gap-3 mt-4 flex-wrap justify-center">
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Go to Dashboard
        </button>

        <button
          onClick={() => router.push("/orders")}
          className="border px-6 py-2 rounded-lg"
        >
          View My Orders
        </button>
      </div>

      <Link
        href="/"
        className="text-sm text-gray-500 mt-4 hover:underline"
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