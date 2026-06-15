import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-transparent text-[#111827] flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-[white] border border-[#111827]/10 rounded-3xl p-10 text-center">
        <h1 className="text-3xl font-serif tracking-tight md:text-4xl font-serif tracking-tight mb-4">Payment Canceled</h1>
        <p className="text-neutral-600 mb-8">
          No charges were made. You can retry the payment whenever you are ready.
        </p>
        <Link
          href="/client/dashboard"
          className="inline-flex px-6 py-3 rounded-xl bg-white/10 border border-[#111827]/10 hover:bg-white/15 transition-colors font-semibold"
        >
          Return to Client Dashboard
        </Link>
      </div>
    </main>
  );
}
