import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse, NextRequest } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getUserFromRequest } from "@/lib/auth";
import { Resend } from "resend";


type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderRequest = {
  items: OrderItem[];
  totalAmount: number;
  customerEmail: string;
};

// ✅ CREATE ORDER (PUBLIC)
export async function POST(req: Request) {
  try {
    await connectDB();

    const body: OrderRequest = await req.json();

    if (!body.items || !body.totalAmount || !body.customerEmail) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      ...body,
      status: "paid",
    });

    return NextResponse.json({
      ...order.toObject(),
      _id: order._id.toString(),
    });
  } catch (error) {
    console.error("POST ERROR:", error);

    return NextResponse.json(
      { message: "Error creating order" },
      { status: 500 }
    );
  }
}

// 🔒 FETCH ORDERS (USER ONLY)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);

    // ❌ NOT LOGGED IN
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ ONLY FETCH USER ORDERS
    const orders = await Order.find({
      customerEmail: user.email,
    }).sort({ createdAt: -1 });

    const cleanOrders = orders.map((o) => ({
      _id: o._id.toString(),
      customerEmail: o.customerEmail,
      totalAmount: o.totalAmount,
      status: o.status,
      items: o.items,
      createdAt: o.createdAt,
    }));

    return NextResponse.json(cleanOrders);
  } catch (error) {
    console.error("GET ERROR:", error);

    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}

// 🔒 DELETE ORDER (ADMIN ONLY)
export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Order ID required" },
        { status: 400 }
      );
    }

    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Order deleted" });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { message: "Error deleting order" },
      { status: 500 }
    );
  }
}

// 🔒 UPDATE ORDER STATUS (ADMIN ONLY)
export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    // 🔥 GET EXISTING ORDER
    const existing = await Order.findById(id);

    if (!existing) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // 🔥 PREVENT UNNECESSARY UPDATE
    if (existing.status === status) {
      return NextResponse.json({
        ...existing.toObject(),
        _id: existing._id.toString(),
      });
    }

    // 🔥 UPDATE STATUS
    existing.status = status;
    await existing.save();

    // 🔥 SEND EMAIL
    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
      from: "Nature Smokehouse <noreply@smokehouse.obiresoffice.com>",
      to: existing.customerEmail,
      subject: "Order Status Update",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#16a34a;">📦 Order Update</h2>

          <p>Your order status has changed.</p>

          <p><strong>Status:</strong> ${status.toUpperCase()}</p>
          <p><strong>Order ID:</strong> ${existing._id}</p>

          ${
            status === "processing"
              ? "<p>We are preparing your order.</p>"
              : ""
          }

          ${
            status === "shipped"
              ? "<p>Your order is on the way 🚚</p>"
              : ""
          }

          ${
            status === "delivered"
              ? "<p>Your order has been delivered 🎉</p>"
              : ""
          }

          <hr />

          <p style="font-size:12px;color:gray;">
            Nature Smokehouse
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      ...existing.toObject(),
      _id: existing._id.toString(),
    });

  } catch (error) {
    console.error("PATCH ERROR:", error);

    return NextResponse.json(
      { message: "Error updating order" },
      { status: 500 }
    );
  }
}