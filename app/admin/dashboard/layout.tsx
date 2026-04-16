"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Menu,
} from "lucide-react";
import { useState } from "react";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
      pathname === path
        ? "bg-white text-black font-semibold"
        : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-black text-white flex items-center justify-between px-4 py-3 z-50">
        <h2 className="font-bold">Admin</h2>
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white p-5 z-50 transform transition ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <button
          onClick={() => setOpen(false)}
          className="mb-6 text-sm text-gray-400"
        >
          Close
        </button>

        <nav className="flex flex-col gap-2">
          <Link href="/admin" className={linkClass("/admin")}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link href="/admin/dashboard/products" className={linkClass("/admin/dashboard/products")}>
            <ShoppingBag size={18} /> Products
          </Link>

          <Link href="/admin/dashboard/orders" className={linkClass("/admin/dashboard/orders")}>
            <ClipboardList size={18} /> Orders
          </Link>
        </nav>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-black text-white p-5 flex-col">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <nav className="flex flex-col gap-2">
          <Link href="/admin" className={linkClass("/admin")}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link href="/admin/dashboard/products" className={linkClass("/admin/dashboard/products")}>
            <ShoppingBag size={18} /> Products
          </Link>

          <Link href="/admin/dashboard/orders" className={linkClass("/admin/dashboard/orders")}>
            <ClipboardList size={18} /> Orders
          </Link>
        </nav>

        <div className="mt-auto pt-10">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}