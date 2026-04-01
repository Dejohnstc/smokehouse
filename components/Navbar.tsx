"use client";

import Link from "next/link";
import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // 🔥 routes to hide cart
  const hideCartRoutes = ["/checkout", "/payment-success"];

  const shouldHideCart = hideCartRoutes.some((route) =>
    pathname.includes(route)
  );

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 gap-4">

        {/* LOGO */}
        <h1 className="text-lg md:text-xl font-bold tracking-wide whitespace-nowrap">
          Nature Smokehouse
        </h1>

        {/* 🔍 DESKTOP SEARCH */}
        <div className="flex-1 max-w-xl hidden md:block">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && search.trim()) {
                window.location.href = `/search?q=${search}`;
              }
            }}
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 relative">

          {/* 🔥 MOBILE SEARCH ICON */}
          <button
            onClick={() => setShowSearch(true)}
            className="md:hidden text-xl"
          >
            🔍
          </button>

          {hydrated && (
            <>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white hover:scale-105 transition"
                  >
                    👤
                  </button>

                  <div
                    className={`absolute right-0 top-full mt-3 w-44 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm transition-all duration-200 ease-out
                    ${
                      open
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <p className="font-semibold mb-2 truncate text-center">
                      {user.email}
                    </p>

                    <Link
                      href="/account"
                      className="block py-1.5 rounded hover:bg-gray-100 transition text-center"
                    >
                      My Account
                    </Link>

                    <Link
                      href="/orders"
                      className="block py-1.5 rounded hover:bg-gray-100 transition text-center"
                    >
                      Orders
                    </Link>

                    <hr className="my-2" />

                    <button
                      onClick={logout}
                      className="w-full py-1.5 rounded text-red-500 hover:bg-red-50 text-center transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium hover:underline"
                >
                  Login
                </Link>
              )}
            </>
          )}

          {/* 🛒 CART (HIDDEN ON CHECKOUT) */}
          {!shouldHideCart && (
            <Link href="/cart" className="relative text-xl">
              🛒

              {hydrated && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
        </div>
      </nav>

      {/* 🔥 MOBILE SEARCH OVERLAY */}
      {showSearch && (
        <div className="fixed inset-0 bg-white z-50 flex items-start p-4 gap-2">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && search.trim()) {
                window.location.href = `/search?q=${search}`;
                setShowSearch(false);
              }
            }}
            placeholder="Search products..."
            className="flex-1 px-4 py-3 rounded-full bg-gray-100 focus:outline-none"
          />

          <button
            onClick={() => setShowSearch(false)}
            className="text-lg px-3"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}