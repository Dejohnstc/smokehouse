"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block border p-4 rounded-xl hover:shadow-md transition"
            >
              <div className="flex justify-between">
                <p className="font-medium">
                  Order #{order._id.slice(-6)}
                </p>

                <p className="text-sm text-gray-500">
                  {order.status}
                </p>
              </div>

              <p className="text-sm text-gray-600">
                ₦{order.totalAmount}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}