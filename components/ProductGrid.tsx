"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import Link from "next/link";

// ✅ Define Product type
type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
};

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  const [page, setPage] = useState(1);
  const perPage = 8;

  const paginated = products.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  return (
    <section className="px-4 md:px-6 py-12 bg-gray-50">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Featured Products
      </h2>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {paginated.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-200"
          >
            {/* 🔥 CLICKABLE IMAGE */}
            <Link href={`/product/${item._id}`}>
              <div className="w-full h-44 bg-gray-100 overflow-hidden cursor-pointer">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
            </Link>

            {/* CONTENT */}
            <div className="p-3 space-y-1">
              <Link href={`/product/${item._id}`}>
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:underline cursor-pointer">
                  {item.name}
                </h3>
              </Link>

              <p className="font-semibold text-gray-900">
                ₦{item.price}
              </p>
            </div>

            {/* BUTTON */}
            <div className="p-3 pt-0">
              <button
                onClick={() => addToCart(item)}
                className="w-full bg-green-600 text-white py-2 rounded-full text-sm font-medium hover:bg-green-700 active:scale-95 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 PAGINATION */}
      <div className="flex justify-center mt-10 gap-2 flex-wrap">
        {[...Array(Math.ceil(products.length / perPage))].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-10 h-10 rounded-full ${
              page === i + 1
                ? "bg-gray-300"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}