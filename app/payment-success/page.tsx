"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState("Verifying payment...");
  const [order, setOrder] = useState<Order | null>(null);

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
          setOrder(data); // ✅ store order
        } else {
          setStatus("Payment verification failed");
        }
      } catch (err) {
        setStatus("Something went wrong");
      }
    };

    verifyPayment();
  }, [reference]);

  // ✅ WHATSAPP MESSAGE
  const phone = "2348078417869"; // 🔥 replace with your number

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

      {/* ✅ WHATSAPP BUTTON (only show when order exists) */}
      {order && (
        <a
          href={whatsappLink}
          target="_blank"
          className="bg-green-600 text-white px-6 py-3 rounded-lg mt-4"
        >
          Chat on WhatsApp
        </a>
      )}

      <Link
        href="/"
        className="bg-black text-white px-6 py-2 rounded-lg mt-4"
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