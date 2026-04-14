import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, amount } = await req.json();

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // kobo
      currency: "NGN",
      callback_url: "https://https://smokehouse.obiresoffice.com///payment-success",
    }),
  });

  const data = await res.json();

  return NextResponse.json(data.data);
}