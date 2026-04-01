"use client";

import { useCart } from "@/components/CartContext";
import Link from "next/link";

export default function CartPage() {
  const {
    cart,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty 🛒</h1>
        <p className="text-gray-500 mb-6">
          Looks like you haven’t added anything yet.
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

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-10">
        
        {/* 🧱 LEFT: ITEMS */}
        <div className="md:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 bg-white p-4 rounded-xl shadow-sm"
            >
              {/* IMAGE */}
              <img
                src={item.image}
                className="w-24 h-24 object-cover rounded-lg"
              />

              {/* DETAILS */}
              <div className="flex-1">
                <h2 className="font-medium">{item.name}</h2>

                <p className="text-sm text-gray-500 mb-2">
                  ₦{item.price}
                </p>

                {/* 🔥 QUANTITY CONTROLS */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.quantity - 1)
                    }
                    className="w-8 h-8 bg-gray-200 rounded-full"
                  >
                    −
                  </button>

                  <span className="font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.quantity + 1)
                    }
                    className="w-8 h-8 bg-gray-200 rounded-full"
                  >
                    +
                  </button>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 text-sm mt-2"
                >
                  Remove
                </button>
              </div>

              {/* PRICE */}
              <div className="font-semibold">
                ₦{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* 🧱 RIGHT: SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow-sm h-fit sticky top-20">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2 text-sm">
            <span>Subtotal</span>
            <span>₦{totalPrice}</span>
          </div>

          <div className="flex justify-between mb-4 text-sm">
            <span>Delivery</span>
            <span className="text-gray-500">Calculated at checkout</span>
          </div>

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>₦{totalPrice}</span>
          </div>

          {/* 🔥 CHECKOUT */}
          <Link
            href="/checkout"
            className="block w-full text-center bg-black text-white py-3 rounded-xl mb-3"
          >
            Proceed to Checkout
          </Link>

          {/* CLEAR CART */}
          <button
            onClick={clearCart}
            className="w-full text-sm text-gray-500 hover:underline"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}