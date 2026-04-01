"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-xl p-3 hover:shadow-md transition">
      {/* 🔥 CLICKABLE IMAGE */}
      <Link href={`/product/${product._id}`}>
        <img
          src={product.image}
          className="w-full h-48 object-cover rounded-lg mb-3 cursor-pointer"
        />
      </Link>

      {/* INFO */}
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-2">₦{product.price}</p>

      {/* 🔥 ADD TO CART */}
      <button
        onClick={() => addToCart(product)}
        className="w-full bg-black text-white py-2 rounded-lg text-sm"
      >
        Add to Cart
      </button>
    </div>
  );
}