import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, items } = body;

    if (!amount || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET) {
      throw new Error("PAYSTACK_SECRET_KEY missing");
    }

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email, // ✅ CLEAN (NO ANY)
          amount,
          currency: "NGN",
          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success`,
          metadata: {
            items,
          },
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("PAYSTACK INIT ERROR:", error);

    return NextResponse.json(
      { message: "Payment init failed" },
      { status: 500 }
    );
  }
}