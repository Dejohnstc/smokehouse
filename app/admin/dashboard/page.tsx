"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  _id: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 📦 FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin"); // 🔥 login page
          return;
        }

        const data: Order[] = await res.json();
        setOrders(data);
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  // 🔄 UPDATE STATUS
  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);

    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin");
        return;
      }

      const updated: Order = await res.json();

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updated : o))
      );
    } finally {
      setActionLoading(null);
    }
  };

  // 📊 STATS
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (acc, o) => acc + o.totalAmount,
    0
  );

  return (
    <AdminProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Manage orders & operations
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/dashboard/orders"
              className="bg-black text-white px-4 py-2 rounded-xl text-sm"
            >
              Orders
            </Link>

            <Link
              href="/admin/dashboard/products"
              className="border px-4 py-2 rounded-xl text-sm"
            >
              Products
            </Link>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow border">
            <p className="text-gray-500 text-sm">Orders</p>
            <h2 className="text-3xl font-bold">{totalOrders}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border">
            <p className="text-gray-500 text-sm">Revenue</p>
            <h2 className="text-3xl font-bold">₦{totalRevenue}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border">
            <p className="text-gray-500 text-sm">System</p>
            <h2 className="text-green-600 font-semibold">● Live</h2>
          </div>
        </div>

      </div>
    </AdminProtectedRoute>
  );
}