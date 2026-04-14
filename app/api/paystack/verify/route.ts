import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { reference } = await req.json();

    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const data = await res.json();

    if (data.data.status !== "success") {
      return NextResponse.json(
        { message: "Payment not successful" },
        { status: 400 }
      );
    }

    // ✅ PREVENT DUPLICATE ORDERS
    const existing = await Order.findOne({ reference });

    if (existing) {
      return NextResponse.json({
        _id: existing._id.toString(),
        items: existing.items,
        totalAmount: existing.totalAmount,
      });
    }

    // ✅ SAVE ORDER
    const order = await Order.create({
      reference, // 🔥 IMPORTANT
      items: data.data.metadata.items,
      totalAmount: data.data.amount / 100,
      customerEmail: data.data.customer.email,
      status: "paid",
    });

    // ✅ CLEAN RESPONSE (IMPORTANT)
    return NextResponse.json({
      _id: order._id.toString(),
      items: order.items,
      totalAmount: order.totalAmount,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}