"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔐 GET TOKEN
  const getToken = () => localStorage.getItem("admin_token");

  // 📦 FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin");
          return;
        }

        const data: Product[] = await res.json();
        setProducts(data);
      } catch {
        setError("Failed to load products");
      } finally {
        setPageLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  // ➕ ADD PRODUCT
  const addProduct = async () => {
    if (!name || !price || !image || !category) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          image,
          category,
        }),
      });

      if (res.status === 401) {
        router.push("/admin");
        return;
      }

      const newProduct: Product = await res.json();

      setProducts((prev) => [newProduct, ...prev]);

      // reset
      setName("");
      setPrice("");
      setImage("");
      setCategory("");
    } catch {
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // 🗑 DELETE
  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.status === 401) {
        router.push("/admin");
        return;
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  // ✏️ UPDATE
  const updateProduct = async () => {
    if (!editing) return;

    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(editing),
      });

      if (res.status === 401) {
        router.push("/admin");
        return;
      }

      const updated: Product = await res.json();

      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );

      setEditing(null);
    } catch {
      alert("Update failed");
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-gray-500 text-sm">
              Manage your inventory
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className="border px-4 py-2 rounded-xl text-sm"
          >
            ← Dashboard
          </button>
        </div>

        {/* STATES */}
        {pageLoading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid md:grid-cols-3 gap-10">

          {/* ADD PRODUCT */}
          <div className="bg-white p-6 rounded-2xl shadow border space-y-4">
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
            />

            {image && (
              <img
                src={image}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}

            <button
              onClick={addProduct}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>

          {/* PRODUCTS LIST */}
          <div className="md:col-span-2 grid gap-5">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex justify-between items-center bg-white p-4 rounded-2xl shadow border"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-[420px] space-y-4">

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

              <div className="flex justify-between">
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
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
}