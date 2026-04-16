"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

type Item = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  items: Item[];
  createdAt: string;
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 📦 FETCH ORDER
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        const res = await fetch(`/api/orders/${id}`, {
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
        setOrder(data);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, router]);

  const steps = ["paid", "processing", "shipped", "delivered"];
  const currentStep = steps.indexOf(order?.status || "paid");

  const formatPrice = (n: number) =>
    `₦${n.toLocaleString()}`;

  // 🎨 STATUS STYLE
  const statusColor = (status: string) => {
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

  // 🔄 UPDATE STATUS
  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    setUpdating(true);

    try {
      const token = localStorage.getItem("admin_token");

      await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: order._id,
          status: newStatus,
        }),
      });

      setOrder((prev) =>
        prev ? { ...prev, status: newStatus } : prev
      );
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back
          </button>

          <h1 className="text-xl font-semibold tracking-tight">
            Order Details
          </h1>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded-xl" />
            <div className="h-32 bg-gray-200 rounded-xl" />
            <div className="h-40 bg-gray-200 rounded-xl" />
          </div>
        )}

        {order && (
          <div className="space-y-6">

            {/* 🧾 ORDER CARD */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <div className="flex justify-between items-start">

                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="font-semibold text-lg">
                    #{order._id.slice(-8)}
                  </p>

                  <p className="text-sm text-gray-500 mt-3">
                    {order.customerEmail}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <span
                  className={`text-xs px-3 py-1 rounded-full ${statusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* 🚚 STATUS SECTION */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-5">

              <div className="flex justify-between items-center">
                <p className="font-semibold">Order Status</p>

                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value)
                  }
                  disabled={updating}
                  className="border px-3 py-2 rounded-lg text-sm"
                >
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {updating && (
                <p className="text-xs text-gray-400">
                  Updating status...
                </p>
              )}

              {/* TIMELINE */}
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step} className="flex-1 text-center">

                    <div
                      className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition
                        ${
                          index <= currentStep
                            ? "bg-black text-white scale-105"
                            : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {index + 1}
                    </div>

                    <p className="text-xs mt-2 capitalize">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🛒 ITEMS */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <p className="font-semibold mb-5">Items</p>

              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 💰 TOTAL */}
            <div className="bg-black text-white p-6 rounded-2xl shadow flex justify-between items-center">
              <p className="text-sm opacity-80">
                Total Amount
              </p>

              <p className="text-2xl font-bold">
                {formatPrice(order.totalAmount)}
              </p>
            </div>

          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
}