"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-12 mt-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-xl font-bold mb-3">Nature Smokehouse</h2>
          <p className="text-gray-400 text-sm">
            Premium smoked products delivered fresh to your doorstep.
          </p>

          <div className="mt-4 space-y-1 text-sm text-gray-400">
            <p>📞 +2348154687701</p>
            <p>📍 Shomolu, Lagos</p>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <Link href="/" className="block hover:text-white">
              Home
            </Link>
            <Link href="/cart" className="block hover:text-white">
              Cart
            </Link>
            <Link href="/orders" className="block hover:text-white">
              Orders
            </Link>
            <Link href="/login" className="block hover:text-white">
              Login
            </Link>
          </div>
        </div>

        {/* CUSTOMER */}
        <div>
          <h3 className="font-semibold mb-4">Customer</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p className="hover:text-white cursor-pointer">Help Center</p>
            <p className="hover:text-white cursor-pointer">Delivery Info</p>
            <p className="hover:text-white cursor-pointer">Returns Policy</p>
            <p className="hover:text-white cursor-pointer">Privacy Policy</p>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="font-semibold mb-4">
            Get Discounts & Updates
          </h3>

          <input
            placeholder="Enter your email"
            className="w-full p-3 rounded bg-gray-800 mb-3 outline-none text-sm"
          />

          <button className="w-full bg-green-600 py-3 rounded font-semibold hover:opacity-90">
            Subscribe
          </button>

          {/* SOCIALS */}
          <div className="flex gap-3 mt-5 text-xl">
            <a href="#" className="hover:scale-110 transition">📱</a>
            <a href="#" className="hover:scale-110 transition">📸</a>
            <a href="#" className="hover:scale-110 transition">🐦</a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Nature Smokehouse. All rights reserved.
      </div>
    </footer>
  );
}