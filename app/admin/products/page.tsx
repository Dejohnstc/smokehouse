"use client";

import { useEffect, useState } from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  const addProduct = async () => {
    if (!name || !price || !image || !category)
      return alert("Fill all fields");

    setLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
        image,
        category,
      }),
    });

    const newProduct: Product = await res.json();

    setProducts((prev) => [newProduct, ...prev]);

    setName("");
    setPrice("");
    setImage("");
    setCategory("");
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const updateProduct = async () => {
    if (!editing) return;

    const res = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    const updated: Product = await res.json();

    setProducts((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );

    setEditing(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Product Manager</h1>
        <p className="text-gray-500 text-sm">
          Manage your store inventory
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        
        {/* ADD PRODUCT CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-md border space-y-4">
          <h2 className="font-semibold text-lg">Add Product</h2>

          <input
            placeholder="Product name"
            className="w-full border rounded-lg p-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Price"
            type="number"
            className="w-full border rounded-lg p-3"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <select
            className="w-full border rounded-lg p-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="stash">Stash</option>
            <option value="rolling">Rolling</option>
            <option value="scents">Scents</option>
            <option value="shisha">Shisha</option>
          </select>

          {/* IMAGE UPLOAD */}
          <input
            type="file"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);

              const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              const data = await res.json();
              setImage(data.url);
            }}
            className="w-full"
          />

          {/* IMAGE PREVIEW */}
          {image && (
            <img
              src={image}
              className="w-full h-40 object-cover rounded-lg"
            />
          )}

          <button
            onClick={addProduct}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>

        {/* PRODUCTS LIST */}
        <div className="md:col-span-2 grid gap-5">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex justify-between items-center bg-white p-4 rounded-2xl shadow border hover:shadow-md transition"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={product.image}
                  className="w-16 h-16 rounded-lg object-cover"
                />

                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    ₦{product.price}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {product.category}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(product)}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(product._id)}
                  className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-[420px] space-y-4 shadow-xl">

            <h2 className="text-lg font-semibold">
              Edit Product
            </h2>

            <input
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="number"
              value={editing.price}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  price: Number(e.target.value),
                })
              }
              className="w-full border p-3 rounded-lg"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditing(null)}
                className="text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={updateProduct}
                className="bg-black text-white px-5 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}