"use client";

import { useCart } from "@/components/CartContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, totalPrice } = useCart();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = async () => {
    if (!email) return alert("Enter your email");
    if (cart.length === 0) return alert("Cart is empty");

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: totalPrice,
        }),
      });

      const data = await res.json();

      // 🔥 Redirect to Paystack
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error(err);
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Cart is empty 🛒</h1>
        <Link
          href="/"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-10">
        
        {/* 🧱 LEFT: FORM */}
        <div className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* 🔥 TRUST BADGES */}
          <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 space-y-2">
            <p>🔒 Secure payment powered by Paystack</p>
            <p>🚚 Fast delivery</p>
            <p>↩ 7-day return guarantee</p>
          </div>

          {/* PAY BUTTON */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl text-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Redirecting..." : `Pay ₦${totalPrice}`}
          </button>
        </div>

        {/* 🧱 RIGHT: ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4 mb-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₦{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <hr className="mb-4" />

          <div className="flex justify-between mb-2 text-sm">
            <span>Subtotal</span>
            <span>₦{totalPrice}</span>
          </div>

          <div className="flex justify-between mb-4 text-sm">
            <span>Delivery</span>
            <span className="text-gray-500">
              Calculated at payment
            </span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₦{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}