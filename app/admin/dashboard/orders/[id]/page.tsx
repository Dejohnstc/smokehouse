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

  // 🎨 STATUS STEP
  const steps = ["paid", "processing", "shipped", "delivered"];

  const currentStep = steps.indexOf(order?.status || "paid");

  return (
    <AdminProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back
          </button>

          <h1 className="text-xl font-semibold">
            Order Details
          </h1>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {order && (
          <div className="space-y-6">

            {/* 🧾 ORDER INFO */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <p className="text-sm text-gray-500 mb-2">
                Order ID
              </p>

              <p className="font-semibold text-lg">
                #{order._id}
              </p>

              <p className="text-sm text-gray-500 mt-3">
                {order.customerEmail}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            {/* 🚚 STATUS TIMELINE */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <p className="font-semibold mb-4">Order Progress</p>

              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step} className="flex-1 text-center">

                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium
                        ${
                          index <= currentStep
                            ? "bg-black text-white"
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
              <p className="font-semibold mb-4">Items</p>

              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium">
                      ₦{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 💰 TOTAL */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-center">
              <p className="text-gray-500">Total</p>

              <p className="text-xl font-bold">
                ₦{order.totalAmount}
              </p>
            </div>

          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
}