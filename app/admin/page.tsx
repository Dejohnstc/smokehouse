"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// TYPES
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
      return;
    }
  }, [router]);

  // 🗑 DELETE ORDER
  const deleteOrder = async (id: string) => {
    const confirmDelete = confirm("Delete this order?");
    if (!confirmDelete) return;

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

      // 🔥 HANDLE UNAUTHORIZED
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        router.push("/admin-login");
        return;
      }

      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
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

      // 🔥 HANDLE UNAUTHORIZED
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        router.push("/admin-login");
        return;
      }

      const updated: Order = await res.json();

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updated : o))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    } finally {
      setActionLoading(null);
    }
  };

  // 📦 FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");

        if (!res.ok) throw new Error("Failed");

        const data: Order[] = await res.json();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 📊 STATS
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (acc, o) => acc + o.totalAmount,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

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
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Orders</p>
          <h2 className="text-2xl font-bold">{totalOrders}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Revenue</p>
          <h2 className="text-2xl font-bold">₦{totalRevenue}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">System</p>
          <h2 className="text-green-600 font-semibold">
            Live
          </h2>
        </div>
      </div>

      {/* ORDERS */}
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && orders.length === 0 && <p>No orders yet</p>}

      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">
                {order.customerEmail}
              </h3>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="text-sm border rounded-lg px-2 py-1"
              >
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
              </select>
            </div>

            <p className="text-gray-500 mb-2">
              ₦{order.totalAmount}
            </p>

            <div className="text-sm mb-3 space-y-1">
              {order.items.map((item, i) => (
                <p key={i}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            <button
              onClick={() => deleteOrder(order._id)}
              disabled={actionLoading === order._id}
              className="text-red-500 text-sm hover:underline disabled:opacity-50"
            >
              {actionLoading === order._id
                ? "Processing..."
                : "Delete Order"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}