"use client";

import { useCart } from "@/components/CartContext";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

type Props = {
  product: Product;
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
    >
      Add to Cart
    </button>
  );
}