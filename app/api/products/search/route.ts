import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const products = await Product.find({
    name: { $regex: query, $options: "i" },
  }).limit(20);

  return NextResponse.json(products);
}