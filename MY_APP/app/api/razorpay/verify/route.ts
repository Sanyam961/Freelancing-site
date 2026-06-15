import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const keySecret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  if (!keySecret) {
    return NextResponse.json(
      { error: "Missing RAZORPAY_KEY_SECRET." },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const orderId = String(body?.razorpay_order_id ?? "");
    const paymentId = String(body?.razorpay_payment_id ?? "");
    const signature = String(body?.razorpay_signature ?? "");

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Missing Razorpay verification fields." },
        { status: 400 },
      );
    }

    const digest = createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (digest !== signature) {
      return NextResponse.json(
        { error: "Payment signature verification failed." },
        { status: 400 },
      );
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return NextResponse.json(
      { error: "Unable to verify Razorpay payment." },
      { status: 500 },
    );
  }
}
