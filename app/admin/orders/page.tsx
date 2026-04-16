"use client";

import { useEffect, useState } from "react";

type Order = {
  _id: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("admin_token");

    await fetch("/api/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    });

    // 🔄 update UI instantly
    setOrders((prev) =>
      prev.map((o) =>
        o._id === id ? { ...o, status } : o
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      <h1 className="text-3xl font-bold mb-8">
        Orders Dashboard
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-5 rounded-2xl shadow border flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                #{order._id.slice(-6)}
              </p>

              <p className="text-sm text-gray-500">
                {order.customerEmail}
              </p>

              <p className="text-sm">
                ₦{order.totalAmount}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            {/* 🔥 STATUS CONTROL */}
            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
              className="border px-3 py-2 rounded-lg"
            >
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}