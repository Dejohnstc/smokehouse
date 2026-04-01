"use client";

import { useEffect, useState } from "react";

// ✅ Type
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

  // ✅ EDIT STATE
  const [editing, setEditing] = useState<Product | null>(null);

  // ✅ Fetch
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  // ✅ Add
  const addProduct = async () => {
    if (!name || !price || !image || !category) return alert("Fill all fields");

    setLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price), image, category }),
    });

    const newProduct: Product = await res.json();

    setProducts((prev) => [newProduct, ...prev]);

    setName("");
    setPrice("");
    setImage("");
    setCategory("");
    setLoading(false);
  };

  // ✅ Delete
  const deleteProduct = async (id: string) => {
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  // ✅ Update
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
      <h1 className="text-3xl font-semibold mb-8">Product Manager</h1>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* LEFT */}
        <div className="bg-white p-5 rounded-xl shadow-sm space-y-4">
          <h2 className="font-semibold">Add Product</h2>

          <input
            placeholder="Product name"
            className="w-full border rounded-lg p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Price"
            type="number"
            className="w-full border rounded-lg p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <select
            className="w-full border rounded-lg p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="stash">Stash</option>
            <option value="rolling">Rolling</option>
            <option value="scents">Scents</option>
            <option value="shisha">Shisha</option>
          </select>

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
            className="w-full border rounded-lg p-2"
          />

          <button
            onClick={addProduct}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-xl"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-2 space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex justify-between items-center bg-white border p-4 rounded-xl shadow-sm"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={product.image}
                  className="w-14 h-14 rounded object-cover"
                />

                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">₦{product.price}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(product)}
                  className="text-blue-500 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(product._id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-3">
            <h2 className="font-semibold">Edit Product</h2>

            <input
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              className="w-full border p-2"
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
              className="w-full border p-2"
            />

            <button
              onClick={updateProduct}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setEditing(null)}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}