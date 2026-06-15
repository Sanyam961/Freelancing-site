import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-transparent text-[#111827] flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-[white] border border-[#111827]/10 rounded-3xl p-10 text-center shadow-[0_20px_80px_rgba(99,102,241,0.12)]">
        <h1 className="text-3xl font-serif tracking-tight md:text-4xl font-serif tracking-tight mb-4">Payment Successful</h1>
        <p className="text-neutral-600 mb-8">
          Your Stripe payment was completed. You can now continue with your project workflow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/client/dashboard"
            className="px-6 py-3 rounded-xl bg-[#143D30] text-white border border-[#111827]/10 shadow-sm font-medium hover:bg-[#143D30] text-white border border-[#111827]/10 shadow-sm font-medium transition-colors font-semibold"
          >
            Back to Client Dashboard
          </Link>
          <Link
            href="/chat"
            className="px-6 py-3 rounded-xl bg-white/10 border border-[#111827]/10 hover:bg-white/15 transition-colors font-semibold"
          >
            Open Chat
          </Link>
        </div>
      </div>
    </main>
  );
}
