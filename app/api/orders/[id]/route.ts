import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse, NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // 🔒 ADMIN CHECK
    const admin = verifyAdmin(req);

    if (admin) {
      // ✅ Admin can see ANY order
      return NextResponse.json({
        _id: order._id.toString(),
        customerEmail: order.customerEmail,
        totalAmount: order.totalAmount,
        status: order.status,
        items: order.items,
        createdAt: order.createdAt,
      });
    }

    // 👤 USER CHECK
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

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