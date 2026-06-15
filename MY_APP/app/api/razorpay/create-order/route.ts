import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay =
  keyId && keySecret
    ? new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      })
    : null;

export async function POST(req: NextRequest) {
  if (!razorpay || !keyId) {
    return NextResponse.json(
      { error: "Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET." },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const amount = Number(body?.amount ?? 0);
    const currency = String(body?.currency ?? "INR").toUpperCase();

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number." },
        { status: 400 },
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `skillify_${Date.now()}`,
      notes: {
        source: "skillify",
      },
    });

    return NextResponse.json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);
    return NextResponse.json(
      { error: "Unable to create Razorpay order." },
      { status: 500 },
    );
  }
}
