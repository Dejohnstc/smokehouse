import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import AddToCartButton from "@/components/product/AddToCartButton";
import Navbar from "@/components/Navbar"; // ✅ ADD THIS

type ProductType = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ FIXED (Next.js 16)
}) {
  const { id } = await params; // ✅ FIXED

  await connectDB();

  const productDoc = await Product.findById(id);

const product: ProductType | null = productDoc
  ? {
      _id: productDoc._id.toString(),
      name: productDoc.name,
      price: productDoc.price,
      image: productDoc.image,
      description: productDoc.description,
    }
  : null;

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          <p className="text-gray-500">Product not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ✅ NAVBAR ADDED */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* 🔥 IMAGE */}
          <div className="w-full h-[450px] bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 🔥 DETAILS */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold mb-4">
              {product.name}
            </h1>

            <p className="text-2xl font-bold text-green-600 mb-4">
              ₦{product.price}
            </p>

            {/* 🔥 TRUST BADGES */}
            <div className="text-sm text-gray-500 mb-6 space-y-1">
              <p>✔ Secure Payment (Paystack)</p>
              <p>🚚 Delivery in 2–5 days</p>
              <p>↩ 7-day return guarantee</p>
            </div>

            {/* 🔥 DESCRIPTION */}
            <p className="text-gray-600 mb-8">
              {product.description || "No description available"}
            </p>

            {/* 🔥 ADD TO CART */}
            <div className="mt-auto">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        {/* 🔥 RELATED */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-4">
            You may also like
          </h2>
          <p className="text-gray-500">
            Related products coming soon...
          </p>
        </div>
      </div>
    </>
  );
}