import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 text-[#111827] border border-[#111827]/10 shadow-sm font-medium rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-[#111827] border border-[#111827]/10 shadow-sm font-medium/10 border border-indigo-500/20 text-[#143D30] text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="h-4 w-4" />
            <span>Next-Gen Freelance Marketplace</span>
          </div>

          <h1 className="text-5xl font-serif tracking-tight sm:text-7xl font-extrabold tracking-tight text-[#111827] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Gravity-Defying{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Freelance Success
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 mb-10 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            Post projects, find elite talent, and collaborate with zero latency. 
            Automated management, secure escrow, and AI-powered matching for the modern workforce.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-700">
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-[#111827] border border-[#111827]/10 shadow-sm font-medium hover:bg-indigo-600 text-[#111827] border border-[#111827]/10 shadow-sm font-medium text-[#111827] rounded-xl font-medium text-lg transition-all duration-300 shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-2 group">
                Find Work
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignInButton>
            
            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-[#111827]/10 shadow-sm hover:bg-[#f2a642] text-[#111827] border border-[#111827]/10 rounded-xl font-medium text-lg transition-all duration-300 shadow-xl">
              Post a Project
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-[#111827]/10/10 animate-in fade-in duration-1000 delay-1000">
            <div className="flex items-center justify-center gap-2 text-[#111827]0">
              <Zap className="h-5 w-5 text-[#143D30]" />
              <span className="text-sm font-medium">Real-time matching</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#111827]0 border-x border-[#111827]/10/10 px-4">
              <ShieldCheck className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium">Secure Escrow</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#111827]0">
              <Sparkles className="h-5 w-5 text-pink-400" />
              <span className="text-sm font-medium">AI-Verified Talent</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
