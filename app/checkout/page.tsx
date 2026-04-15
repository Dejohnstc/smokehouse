"use client";

import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, totalPrice } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    }
  }, [user, mounted, router]);

  const handleCheckout = async () => {
    if (!user) return alert("Please login first");
    if (cart.length === 0) return alert("Cart is empty");

    setLoading(true);

    try {
      const res = await fetch("/api/paystack/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: totalPrice * 100,
          items: cart,
        }),
      });

      const data = await res.json();

      if (data?.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        alert("Payment initialization failed");
      }
    } catch (err) {
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER */}
      <div className="bg-white border-b py-4 px-6">
        <h1 className="text-xl font-semibold">Checkout</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-2 gap-10">
        
        {/* LEFT SIDE */}
        <div className="space-y-6">
          
          {/* ACCOUNT */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <h2 className="font-semibold mb-3">Account</h2>
            <input
              value={user.email}
              disabled
              className="w-full border rounded-lg p-3 bg-gray-100 text-sm"
            />
          </div>

          {/* DELIVERY */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <h2 className="font-semibold mb-3">Delivery</h2>
            <p className="text-sm text-gray-500">
              Delivery details will be confirmed after payment via WhatsApp.
            </p>
          </div>

          {/* TRUST BADGES */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border text-sm space-y-2">
            <p>🔒 Secure payment powered by Paystack</p>
            <p>🚚 Fast nationwide delivery</p>
            <p>↩ 7-day satisfaction guarantee</p>
          </div>

          {/* PAY BUTTON */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Redirecting..." : `Pay ₦${totalPrice}`}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit">
          <h2 className="text-lg font-semibold mb-5">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 items-center"
              >
                {/* IMAGE */}
                <img
                  src={item.image}
                  className="w-16 h-16 object-cover rounded-lg"
                />

                {/* DETAILS */}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                {/* PRICE */}
                <p className="text-sm font-semibold">
                  ₦{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <hr className="my-5" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{totalPrice}</span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>Delivery</span>
              <span>Calculated after payment</span>
            </div>
          </div>

          <hr className="my-5" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₦{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}