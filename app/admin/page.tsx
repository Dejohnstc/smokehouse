"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function AdminPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔒 PROTECT ADMIN
  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin-login");
    }
  }, [router]);

  // 📦 FETCH ORDERS (SECURED)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`, // 🔥 FIXED
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin-login");
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

  // 🗑 DELETE
  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;

    setActionLoading(id);

    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin-login");
        return;
      }

      setOrders((prev) => prev.filter((o) => o._id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  // 🔄 UPDATE STATUS
  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin-login");
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

  const statusColor = (status: string) => {
    if (status === "paid") return "bg-green-100 text-green-600";
    if (status === "processing") return "bg-yellow-100 text-yellow-600";
    if (status === "shipped") return "bg-blue-100 text-blue-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
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
            href="/admin/products"
            className="bg-black text-white px-4 py-2 rounded-xl text-sm"
          >
            Products
          </Link>

          <Link
            href="/"
            className="border px-4 py-2 rounded-xl text-sm"
          >
            Store
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
          <h2 className="text-green-600 font-semibold">
            ● Live
          </h2>
        </div>
      </div>

      {/* ORDERS */}
      <h2 className="text-xl font-semibold mb-4">
        Recent Orders
      </h2>

      {loading && (
        <div className="text-gray-500">Loading orders...</div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-2xl p-5 shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">
                {order.customerEmail}
              </h3>

              <span
                className={`text-xs px-3 py-1 rounded-full ${statusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-gray-500 mb-2 font-medium">
              ₦{order.totalAmount}
            </p>

            <div className="text-sm mb-3 space-y-1">
              {order.items.map((item, i) => (
                <p key={i}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="text-sm border rounded-lg px-3 py-1"
              >
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
              </select>

              <button
                onClick={() => deleteOrder(order._id)}
                disabled={actionLoading === order._id}
                className="text-red-500 text-sm hover:underline"
              >
                {actionLoading === order._id
                  ? "Processing..."
                  : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}