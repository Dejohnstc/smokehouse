"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

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
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState("Verifying payment...");
  const [order, setOrder] = useState<Order | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null); // 🔥 changed

  // ✅ VERIFY PAYMENT
  useEffect(() => {
    if (!reference) return;

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
          setCountdown(5); // 🔥 start countdown HERE
        } else {
          setStatus("Payment verification failed");
        }
      } catch (err) {
        setStatus("Something went wrong");
      }
    };

    verifyPayment();
  }, [reference]);

  // ⏳ COUNTDOWN + REDIRECT
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      router.push("/orders");
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
          Redirecting to your dashboard in{" "}
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

      {/* 🎯 DASHBOARD BUTTON */}
      <button
        onClick={() => router.push("/orders")}
        className="bg-black text-white px-6 py-2 rounded-lg mt-4"
      >
        Go to Dashboard
      </button>

      {/* BACK */}
      <Link
        href="/"
        className="text-sm text-gray-500 mt-3 hover:underline"
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