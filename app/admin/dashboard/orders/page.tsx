"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

type Order = {
  _id: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 📦 FETCH ORDERS (SECURE)
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
          router.push("/admin");
          return;
        }

        const data = await res.json();
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

      const updated = await res.json();

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updated : o))
      );
    } finally {
      setActionLoading(null);
    }
  };

  // 🎨 STATUS STYLES
  const statusStyle = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-600";
      case "processing":
        return "bg-yellow-100 text-yellow-600";
      case "shipped":
        return "bg-blue-100 text-blue-600";
      case "delivered":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-gray-500 text-sm">
              Manage and track customer orders
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className="border px-4 py-2 rounded-xl text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* STATES */}
        {loading && (
          <div className="text-gray-500">Loading orders...</div>
        )}

        {error && (
          <div className="text-red-500">{error}</div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-gray-500">No orders yet</div>
        )}

        {/* ORDERS LIST */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* TOP */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
                
                <div>
                  <p className="font-semibold text-lg">
                    Order #{order._id.slice(-6)}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.customerEmail}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <span
                  className={`text-xs px-3 py-1 rounded-full ${statusStyle(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              {/* PRICE */}
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">
                  ₦{order.totalAmount}
                </p>

                {/* STATUS CONTROL */}
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                  disabled={actionLoading === order._id}
                  className="border px-3 py-2 rounded-lg text-sm"
                >
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* LOADING STATE */}
              {actionLoading === order._id && (
                <p className="text-xs text-gray-400 mt-2">
                  Updating...
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminProtectedRoute>
  );
}