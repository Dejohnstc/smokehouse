import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";
import AddToCartButton from "@/components/product/AddToCartButton";

type ProductType = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  await connectDB();

  const rawProducts = await Product.find({
  category: name.toLowerCase(),
});

const products: ProductType[] = rawProducts.map((p) => ({
  _id: p._id.toString(),
  name: p.name,
  price: p.price,
  image: p.image,
  category: p.category,
}));

  return (
    <div>
      {/* 🔥 HERO */}
      <section className="relative h-[200px] md:h-[250px] w-full">
        <img
          src="https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-white text-3xl md:text-5xl font-bold capitalize">
            {decodeURIComponent(name)}
          </h1>
        </div>
      </section>

      {/* 🔥 BREADCRUMB */}
      <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <span>›</span>
        <span className="uppercase text-gray-700 font-medium">
          {decodeURIComponent(name)}
        </span>
      </div>

      {/* 🔥 PRODUCTS */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-10">
        {products.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* IMAGE */}
                <Link href={`/product/${product._id}`}>
                  <div className="h-44 overflow-hidden cursor-pointer">
                    <img
                      src={product.image}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                </Link>

                {/* CONTENT */}
                <div className="p-3">
                  <Link href={`/product/${product._id}`}>
                    <h2 className="text-sm font-medium cursor-pointer hover:underline">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="font-semibold text-gray-800">
                    ₦{product.price}
                  </p>
                </div>

                {/* ADD TO CART */}
                <div className="p-3 pt-0">
                  <AddToCartButton product={product} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}