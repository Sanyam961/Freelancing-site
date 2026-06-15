"use client";

import React from "react";
import Link from "next/link";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowLeft, Target, Users, Zap, Globe } from "lucide-react";
import { useState } from "react";

function AuthGateModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="border-[3px] border-[#111827] bg-white shadow-[6px_6px_0px_#111827] p-8 max-w-md w-[90%] text-center"
      >
        <h3 className="text-2xl font-serif text-[#111827] mb-3">
          Sign in to continue
        </h3>
        <p className="text-neutral-600 mb-8">
          You need to be signed in to access your profile and start hiring or finding work on SKILLIFY.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <SignInButton mode="modal">
            <button className="w-full sm:w-auto px-8 py-3 bg-[#111827] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#374151] transition-colors border-2 border-[#111827] cursor-pointer">
              Log In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="w-full sm:w-auto px-8 py-3 bg-[#70D7C9] text-[#111827] font-bold uppercase tracking-widest text-sm hover:bg-[#42A596] transition-colors border-2 border-[#111827] cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </div>
        <button
          onClick={onClose}
          className="mt-6 text-sm text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { isSignedIn } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!isSignedIn) {
      e.preventDefault();
      setShowAuthModal(true);
    } else {
      // Already signed in — let the Link navigate
      window.location.href = href;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-gray-900 font-sans border-t-8 border-[#111827]">
      {showAuthModal && (
        <AuthGateModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 hover:bg-[#111827]/5 rounded-full transition-colors font-bold text-sm tracking-widest uppercase">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>
        
        <div className="flex items-center">
          <div className="flex items-center justify-center border-[4px] border-[#374151] px-4 py-1.5 shadow-[3px_3px_0px_#374151] bg-[#42A596] rounded-none">
             <span className="font-black text-2xl text-[#FFFDF5] leading-none tracking-[0.08em] uppercase">SKILLIFY</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 md:py-32 px-4 border-b border-[#111827]/10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block border-[3px] border-[#111827] px-4 py-1.5 bg-[#f2a642] shadow-[3px_3px_0px_#111827] rounded-full mb-8 font-bold text-sm uppercase tracking-widest">
            Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#111827] leading-[1.05] tracking-tight mb-6">
            Redefining how the world <span className="underline decoration-[#70D7C9] decoration-8 underline-offset-4">works together.</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed max-w-3xl mx-auto">
            SKILLIFY is building the ultimate operating system for the future of work. We connect visionary clients with elite global talent in a frictionless, secure, and intuitive ecosystem.
          </p>
        </div>
      </header>

      {/* Content Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center mb-32">
          <div>
            <h2 className="text-4xl font-serif text-[#111827] tracking-tight mb-6">Built for the Modern Professional</h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-6">
              The conventional 9-to-5 is evolving. The best talent no longer wants to be confined by geography or cubicles, and the best companies want access to a worldwide pool of experts.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              That&apos;s why we created SKILLIFY. A streamlined platform that removes the friction from freelancing. We handle the discovery, the contracts, and the escrow, so you can focus completely on creating exceptional work.
            </p>
          </div>
          <div className="bg-[#70D7C9] border-[6px] border-[#111827] shadow-[8px_8px_0px_#111827] p-10 flex items-center justify-center min-h-[300px] relative">
             <div className="absolute top-4 left-4 w-4 h-4 bg-[#111827] rounded-full"></div>
             <div className="absolute top-4 right-4 w-4 h-4 bg-[#111827] rounded-full"></div>
             <div className="absolute bottom-4 left-4 w-4 h-4 bg-[#111827] rounded-full"></div>
             <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#111827] rounded-full"></div>
             <span className="font-bold text-5xl text-[#111827] uppercase tracking-widest text-center leading-tight">
               Build <br/> Without <br/> Borders
             </span>
          </div>
        </div>

        {/* Pillars */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif text-center text-[#111827] tracking-tight mb-16">Our Core Pillars</h2>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-8 border-[3px] border-[#111827] bg-white shadow-[4px_4px_0px_#111827]">
              <Target className="w-10 h-10 text-[#42A596] mb-6" />
              <h3 className="text-xl font-bold uppercase tracking-widest mb-3">Precision</h3>
              <p className="text-neutral-600">No more endless scrolling. We curate discovery to match exact skills with precise project requirements within seconds.</p>
            </div>
            
            <div className="p-8 border-[3px] border-[#111827] bg-white shadow-[4px_4px_0px_#111827]">
              <Zap className="w-10 h-10 text-[#f2a642] mb-6" />
              <h3 className="text-xl font-bold uppercase tracking-widest mb-3">Instant Collaboration</h3>
              <p className="text-neutral-600">Fast communication, real-time updates, and smooth file sharing keep projects moving without confusion.
              </p>
            </div>

            <div className="p-8 border-[3px] border-[#111827] bg-[#42A596] text-white shadow-[4px_4px_0px_#111827]">
              <Globe className="w-10 h-10 text-[#FFFDF5] mb-6" />
              <h3 className="text-xl font-bold uppercase tracking-widest mb-3">Global Access</h3>
              <p className="text-[#FFFDF5]/90">Hire or work from anywhere. Effortless currency conversions and localized workflows make international teaming feel local.</p>
            </div>

            <div className="p-8 border-[3px] border-[#111827] bg-white shadow-[4px_4px_0px_#111827]">
              <Users className="w-10 h-10 text-[#e5a09c] mb-6" />
              <h3 className="text-xl font-bold uppercase tracking-widest mb-3">Community</h3>
              <p className="text-neutral-600">We prioritize human connection. Real people doing real work, supported by a system that actively prevents burn-out and disputes.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#111827] text-white p-16 border-[4px] border-[#111827] shadow-[8px_8px_0px_#e5a09c]">
           <h2 className="text-4xl font-serif tracking-tight mb-6">Ready to join the revolution?</h2>
           <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
             Whether you are looking to hire a brilliant dev, an incredible writer, or you want to monetize your own exceptional skills - SKILLIFY is your home.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={(e) => handleProtectedClick(e, "/onboarding/client")}
                className="w-full sm:w-auto px-8 py-4 bg-[#70D7C9] text-[#111827] font-bold uppercase tracking-widest text-sm hover:bg-[#42A596] transition-colors border-2 border-[#70D7C9] cursor-pointer"
              >
                Hire Talent
              </button>
              <button
                onClick={(e) => handleProtectedClick(e, "/onboarding/profile")}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#111827] transition-colors cursor-pointer"
              >
                Find Work
              </button>
           </div>
        </div>
      </main>

    </div>
  );
}
