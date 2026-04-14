"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

// 🔥 INNER COMPONENT (your original logic)
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!query) return;

    const timeout = setTimeout(() => {
      setLoading(true);

      fetch(`/api/products/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-6">
        Results for &quot;{query}&quot;
      </h1>

      {!query ? (
        <p className="text-gray-500">Start typing to search...</p>
      ) : loading ? (
        <p className="text-gray-500">Searching...</p>
      ) : products.length === 0 ? (
        <p>No results found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl p-3 hover:shadow-md transition"
            >
              <Link href={`/product/${p._id}`}>
                <img
                  src={p.image}
                  className="h-40 w-full object-cover rounded mb-2 cursor-pointer"
                />
              </Link>

              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500 mb-2">₦{p.price}</p>

              <button
                onClick={() => addToCart(p)}
                className="w-full bg-black text-white py-2 rounded-lg text-sm"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 🔥 WRAPPER (FIXES ERROR)
export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <SearchContent />
    </Suspense>
  );
}