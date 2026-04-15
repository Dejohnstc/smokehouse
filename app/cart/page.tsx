"use client";

import { useCart } from "@/components/CartContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const {
    cart = [], // ✅ SAFE DEFAULT
    totalPrice = 0,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // 🛒 EMPTY STATE
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-bold mb-3">Your cart is empty 🛒</h1>
        <p className="text-gray-500 mb-6 max-w-sm">
          Looks like you haven’t added anything yet.
        </p>

        <Link
          href="/"
          className="bg-black text-white px-8 py-3 rounded-full"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      
      <h1 className="text-3xl font-bold mb-10">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-10">
        
        {/* 🧱 LEFT: ITEMS */}
        <div className="md:col-span-2 space-y-5">

          <AnimatePresence>
            {cart.map((item) => {
              if (!item) return null; // ✅ SAFETY

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -120 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -100) {
                      removeFromCart(item._id);
                    }
                  }}
                  className="flex gap-5 bg-white/80 backdrop-blur border border-gray-100 p-5 rounded-2xl shadow-sm"
                >
                  {/* IMAGE (SAFE) */}
                  <img
                    src={item.image || "/placeholder.png"} // ✅ FIX
                    alt={item.name || "product"}
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col justify-between">
                    
                    <div>
                      <h2 className="font-semibold text-lg">
                        {item.name || "Product"}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        ₦{item.price ?? 0}
                      </p>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex items-center justify-between mt-4">
                      
                      <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-full">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="text-lg px-2"
                        >
                          −
                        </button>

                        <span className="font-medium text-sm">
                          {item.quantity ?? 1}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="text-lg px-2"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs text-gray-400">
                        Swipe ← to remove
                      </span>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="font-semibold text-lg whitespace-nowrap">
                    ₦{(item.price ?? 0) * (item.quantity ?? 1)}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

        </div>

        {/* 🧱 RIGHT: SUMMARY */}
        <div className="bg-white/90 backdrop-blur border border-gray-100 p-6 rounded-2xl shadow-sm h-fit sticky top-24">
          
          <h2 className="text-lg font-semibold mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between mb-3 text-sm">
            <span>Subtotal</span>
            <span>₦{totalPrice}</span>
          </div>

          <div className="flex justify-between mb-4 text-sm">
            <span>Delivery</span>
            <span className="text-gray-400">
              Calculated at checkout
            </span>
          </div>

          <div className="flex justify-between font-bold text-xl mb-6">
            <span>Total</span>
            <span>₦{totalPrice}</span>
          </div>

          <Link
            href="/checkout"
            className="block w-full text-center bg-black text-white py-3 rounded-full"
          >
            Proceed to Checkout
          </Link>

          <button
            onClick={clearCart}
            className="w-full text-sm text-gray-500 mt-3"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}