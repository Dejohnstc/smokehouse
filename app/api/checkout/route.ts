import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, amount, items } = await req.json();

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount, // ✅ already in kobo from frontend
        currency: "NGN",

        // ✅ FIXED URL
        callback_url: "https://smokehouse.obiresoffice.com/payment-success",

        // ✅ VERY IMPORTANT
        metadata: {
          items,
        },
      }),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Payment init failed" },
      { status: 500 }
    );
  }
}