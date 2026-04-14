"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthContext";

type Order = {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customerEmail: string;
};

export default function OrdersPage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();

        // ✅ FILTER USER ORDERS
        const userOrders = data.filter(
          (o: Order) => o.customerEmail === user.email
        );

        setOrders(userOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {/* 🔄 LOADING */}
        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          /* ❌ EMPTY STATE */
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">
              You haven’t placed any orders yet
            </p>

            <Link
              href="/"
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* ✅ ORDERS LIST */
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block border p-4 rounded-xl hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    Order #{order._id.slice(-6)}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
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
    </ProtectedRoute>
  );
}