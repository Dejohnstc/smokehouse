import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, amount, items } = body;

    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
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
    console.error(error);

    return NextResponse.json(
      { message: "Payment init failed" },
      { status: 500 }
    );
  }
}