import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse, NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);

    // 🔒 NOT LOGGED IN
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // 🔒 CHECK OWNERSHIP
    if (order.customerEmail !== user.email) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      _id: order._id.toString(),
      customerEmail: order.customerEmail,
      totalAmount: order.totalAmount,
      status: order.status,
      items: order.items,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("GET SINGLE ORDER ERROR:", error);

    return NextResponse.json(
      { message: "Error fetching order" },
      { status: 500 }
    );
  }
}