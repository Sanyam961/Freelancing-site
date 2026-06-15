"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignOutButton } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultAmount = searchParams.get("amount") || "2500";
  const gigId = searchParams.get("gigId");

  const completeGig = useMutation(api.gigs.completeGig);

  const [amount, setAmount] = React.useState(defaultAmount);
  const [isPaying, setIsPaying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadRazorpayScript = async () => {
    if (window.Razorpay) {
      return true;
    }

    return await new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }

    setError(null);
    setIsPaying(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Could not load Razorpay checkout script.");
      }

      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parsedAmount,
          currency: "INR",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.orderId || !data.keyId) {
        throw new Error(data.error || "Failed to create Razorpay order.");
      }

      const razorpay = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "SKILLIFY",
        description: "Project payment",
        order_id: data.orderId,
        handler: async (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentResponse),
          });

          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok || !verifyData.verified) {
            setError(verifyData.error || "Payment verification failed.");
            setIsPaying(false);
            return;
          }

          if (gigId) {
            try {
              await completeGig({ gigId: gigId as Id<"gigs"> });
            } catch (err) {
              console.error("Failed to mark gig as complete:", err);
            }
          }

          router.push("/payment/success");
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
        theme: {
          color: "#6366f1",
        },
      });

      razorpay.open();
    } catch (paymentError) {
      console.error(paymentError);
      setError("Could not start payment. Please try again.");
      setIsPaying(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-[#111827] px-6 py-16">
      <div className="max-w-2xl mx-auto bg-white border border-[#111827]/10 rounded-3xl p-8 md:p-10 shadow-xl">
        <h1 className="text-3xl font-serif tracking-tight tracking-tight mb-3">Payment</h1>
        <p className="text-neutral-600 mb-8">Send secure payment through Razorpay for freelancer or client milestones.</p>

        <label className="text-xs uppercase tracking-widest text-neutral-600 mb-2 block">Amount (INR)</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center rounded-xl border border-[#111827]/10 bg-white shadow-sm px-4 py-3 w-full sm:w-64 focus-within:ring-2 focus-within:ring-indigo-500/50">
            <span className="text-[#111827] mr-2">₹</span>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent outline-none text-[#111827]"
              placeholder="Amount"
            />
          </div>
          <button
            onClick={handlePay}
            disabled={isPaying}
            className="px-6 py-3 rounded-xl bg-[#52c2ad] text-[#111827] font-semibold hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#111827] border border-[#111827]/10 transition-all disabled:opacity-60"
          >
            {isPaying ? "Opening checkout..." : "Pay with Razorpay"}
          </button>
        </div>

        {error ? <p className="text-sm text-red-500 mt-3">{error}</p> : null}

        <div className="mt-8 pt-6 border-t border-[#111827]/10 flex flex-wrap gap-3">
          <Link href="/onboarding/profile" className="px-4 py-2 rounded-lg bg-[#E5DFD3]/50 text-[#111827] hover:bg-[#E5DFD3] transition-colors text-sm font-medium border border-[#111827]/10">Freelancer Setup</Link>
          <Link href="/onboarding/client" className="px-4 py-2 rounded-lg bg-[#E5DFD3]/50 text-[#111827] hover:bg-[#E5DFD3] transition-colors text-sm font-medium border border-[#111827]/10">Client Setup</Link>
          <Link href="/chat" className="px-4 py-2 rounded-lg bg-[#E5DFD3]/50 text-[#111827] hover:bg-[#E5DFD3] transition-colors text-sm font-medium border border-[#111827]/10">Open Chat</Link>
          <SignOutButton redirectUrl="/">
            <button className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium border border-red-200">Logout</button>
          </SignOutButton>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent flex items-center justify-center text-[#111827]">Loading payment gateway...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
