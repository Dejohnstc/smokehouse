import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { Resend } from "resend";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    await connectDB();

    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { message: "Missing reference" },
        { status: 400 }
      );
    }

    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET) {
      throw new Error("PAYSTACK_SECRET_KEY missing");
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const data = await res.json();

    console.log("PAYSTACK VERIFY:", data); // 🔥 DEBUG

    if (!data?.data || data.data.status !== "success") {
      return NextResponse.json(
        { message: "Payment not successful" },
        { status: 400 }
      );
    }

    // ✅ PREVENT DUPLICATE
    const existing = await Order.findOne({ reference });

    if (existing) {
      return NextResponse.json({
        _id: existing._id.toString(),
        items: existing.items,
        totalAmount: existing.totalAmount,
      });
    }

    const items: OrderItem[] = data.data.metadata?.items || [];

    // ❌ IF NO ITEMS → STOP
    if (!items.length) {
      console.error("❌ No items in metadata");
    }

    // ✅ CREATE ORDER
    const order = await Order.create({
      reference,
      items,
      totalAmount: data.data.amount / 100,
      customerEmail: data.data.customer.email,
      status: "paid",
    });

    // ✅ EMAIL SETUP
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY missing");
      return NextResponse.json(order); // don't break order flow
    }

    const resend = new Resend(RESEND_API_KEY);

    // 🧾 FORMAT ITEMS
    const itemsHtml = items
      .map(
        (item) =>
          `<li>${item.name} × ${item.quantity} - ₦${item.price}</li>`
      )
      .join("");

    // 📧 SEND EMAIL
    try {
      const emailRes = await resend.emails.send({
        from: "Nature Smokehouse <noreply@obiresoffice.com>",
        to: order.customerEmail,
        subject: "Order Confirmation - Nature Smokehouse",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color:#16a34a;">🎉 Payment Successful</h2>

            <p>Thank you for your order!</p>

            <h3>🧾 Order Details</h3>
            <ul>${itemsHtml}</ul>

            <p><strong>Total:</strong> ₦${order.totalAmount}</p>

            <p style="margin-top:20px;">
              We will process your order shortly.
            </p>

            <hr />

            <p style="font-size:12px; color:gray;">
              Nature Smokehouse • Premium smoked products
            </p>
          </div>
        `,
      });

      console.log("📧 EMAIL SENT:", emailRes);
    } catch (emailError) {
      console.error("❌ EMAIL ERROR:", emailError);
    }

    return NextResponse.json({
      _id: order._id.toString(),
      items: order.items,
      totalAmount: order.totalAmount,
    });

  } catch (error) {
    console.error("VERIFY ERROR:", error);

    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}