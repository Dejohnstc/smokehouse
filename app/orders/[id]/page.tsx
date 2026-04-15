"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // 🔒 NOT LOGGED IN
        if (res.status === 401) {
          router.push("/login");
          return;
        }

        // 🔒 NOT OWNER
        if (res.status === 403) {
          alert("You are not allowed to view this order");
          router.push("/orders");
          return;
        }

        // ❌ NOT FOUND
        if (res.status === 404) {
          setOrder(null);
          return;
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  // 📦 STATUS STEPS
  const steps = ["paid", "processing", "shipped", "delivered"];

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6">
        {loading ? (
          <p>Loading...</p>
        ) : !order ? (
          <p>Order not found</p>
        ) : (
          <>
            {/* HEADER */}
            <h1 className="text-2xl font-bold mb-4">
              Order #{order._id.slice(-6)}
            </h1>

            <p className="text-sm text-gray-500 mb-6">
              {new Date(order.createdAt).toLocaleString()}
            </p>

            {/* 🚚 STATUS TRACKER */}
            <div className="mb-8">
              <h2 className="font-semibold mb-4">Order Status</h2>

              <div className="flex justify-between items-center">
                {steps.map((step, index) => {
                  const currentIndex = steps.indexOf(order.status);
                  const isActive = index <= currentIndex;

                  return (
                    <div
                      key={step}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                          isActive
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        ✓
                      </div>

                      <p className="text-xs mt-2 capitalize">
                        {step}
                      </p>

                      {index !== steps.length - 1 && (
                        <div
                          className={`h-1 w-full ${
                            isActive
                              ? "bg-green-600"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🧾 ITEMS */}
            <div className="bg-white border rounded-xl p-5 mb-6">
              <h2 className="font-semibold mb-4">Items</h2>

              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      ₦{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₦{order.totalAmount}</span>
              </div>
            </div>

            {/* 📞 SUPPORT */}
            <div className="text-sm text-gray-500">
              Need help? Contact support via WhatsApp.
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}