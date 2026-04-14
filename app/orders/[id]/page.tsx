"use client";

import { useEffect, useState } from "react";

type Item = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  items: Item[];
  totalAmount: number;
  status: string;
};

export default function OrderDetails({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((o: Order) => o._id === params.id);
        setOrder(found);
      });
  }, [params.id]);

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">
        Order Details
      </h1>

      <p className="mb-2">Status: {order.status}</p>
      <p className="mb-4">Total: ₦{order.totalAmount}</p>

      <div className="space-y-3">
        {order.items.map((item, i) => (
          <div key={i} className="border p-3 rounded">
            <p>{item.name}</p>
            <p className="text-sm text-gray-500">
              {item.quantity} × ₦{item.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}