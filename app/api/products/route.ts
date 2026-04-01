import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// ✅ GET PRODUCTS
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}

// ✅ CREATE PRODUCT
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { name, price, image, category, description } = body;

    // ✅ DEBUG
    console.log("Incoming product:", {
      name,
      price,
      image,
      category,
    });

    // ✅ VALIDATION (UPDATED)
    if (!name || !price || !image || !category) {
      return NextResponse.json(
        { message: "Name, price, image and category are required" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      price,
      image,
      category: category.toLowerCase(), // 🔥 important
      description,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    return NextResponse.json(
      { message: "Server error creating product" },
      { status: 500 }
    );
  }
}