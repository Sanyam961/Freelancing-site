"use client";

import React from 'react';
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from 'next/link';
import HeroRiveAnimation from './HeroRiveAnimation';

const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function LandingPage() {
  const { isLoaded, userId } = useAuth();

  return (
    <div className="w-full min-h-screen bg-[#FFFDF5] relative overflow-hidden flex flex-col font-sans text-gray-900 border-r-4 border-[#e5a09c]">

      {/* ── Navigation Bar ── */}
      <nav className="flex items-center justify-between pl-0 pr-6 py-4 w-full relative z-30 text-sm font-medium">
        <div className="flex items-center">
          <div className="flex items-center justify-center border-[6px] border-[#374151] px-6 py-3 mt-1 shadow-[5px_5px_0px_#374151] bg-[#42A596] rounded-none ml-2 md:ml-4 lg:ml-6">
            <span className="font-black text-4xl md:text-5xl lg:text-[3.5rem] text-[#FFFDF5] leading-none tracking-[0.08em] uppercase">SKILLIFY</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-12 lg:gap-16 text-[#111827]/70 font-medium text-base">
          <Link href="/guide" prefetch={true} className="hover:text-gray-900 transition-colors">My Guide</Link>
          <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-900 transition-colors cursor-pointer">Services</button>
          <Link href="/about" prefetch={true} className="hover:text-gray-900 transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-3">
          {(!isLoaded || !userId) ? (
            <>
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="hidden sm:flex items-center gap-2 bg-[#70D7C9] text-[#111827] px-6 py-2 rounded-full border-2 border-[#111827] shadow-[2px_2px_0px_#111827] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111827] transition-all font-bold text-sm cursor-pointer">
                  LOG IN
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="hidden sm:flex items-center gap-2 bg-[#70D7C9] text-[#111827] px-6 py-2 rounded-full border-2 border-[#111827] shadow-[2px_2px_0px_#111827] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111827] transition-all font-bold text-sm cursor-pointer">
                  SIGN UP
                </button>
              </SignUpButton>
            </>
          ) : (
            <Link href="/dashboard">
              <button className="hidden sm:flex items-center gap-2 bg-[#70D7C9] text-[#111827] px-6 py-2 rounded-full border-2 border-[#111827] shadow-[2px_2px_0px_#111827] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111827] transition-all font-bold text-sm cursor-pointer">
                DASHBOARD
              </button>
            </Link>
          )}
          <button className="flex items-center justify-center w-9 h-9 bg-[#70D7C9] text-[#111827] rounded-full border-2 border-[#111827] shadow-[2px_2px_0px_#111827] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111827] transition-all font-bold text-lg leading-none pb-0.5 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 rounded-full blur-[2px] opacity-20"></div>
            ?
          </button>
        </div>
      </nav>

      {/* ── Hero Headline & CTAs ── */}
      <main className="flex flex-col items-center pt-0 px-4 relative z-20">
        <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] 2xl:text-[6.5rem] font-serif text-center leading-[1.1] tracking-tight text-[#111827] hero-scene-fade" style={{ animationDelay: '0.1s' }}>
          A freelancing roadmap <br className="hidden md:block"/> for everyone.
        </h1>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-24 md:mt-36 lg:mt-48 hero-scene-fade" style={{ animationDelay: '0.4s' }}>
          {(!isLoaded || !userId) ? (
            <>
              <SignUpButton mode="modal" fallbackRedirectUrl="/onboarding/client">
                <button className="flex items-center justify-center gap-2 bg-[#70D7C9] text-[#111827] px-6 py-2.5 md:px-7 md:py-3 rounded-full border-[3px] border-[#111827] shadow-[4px_4px_0px_#111827] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#111827] transition-all font-bold text-base md:text-lg w-full sm:w-auto cursor-pointer">
                  HIRE A TALENT <ArrowRight />
                </button>
              </SignUpButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/onboarding/profile">
                <button className="flex items-center justify-center gap-2 bg-white text-[#111827] px-6 py-2.5 md:px-7 md:py-3 rounded-full border-[3px] border-[#111827] shadow-[4px_4px_0px_#111827] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#111827] transition-all font-bold text-base md:text-lg w-full sm:w-auto cursor-pointer">
                  BECOME A FREELANCER <ArrowRight />
                </button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link href="/onboarding/client">
                <button className="flex items-center justify-center gap-2 bg-[#70D7C9] text-[#111827] px-6 py-2.5 md:px-7 md:py-3 rounded-full border-[3px] border-[#111827] shadow-[4px_4px_0px_#111827] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#111827] transition-all font-bold text-base md:text-lg w-full sm:w-auto cursor-pointer">
                  HIRE A TALENT <ArrowRight />
                </button>
              </Link>
              <Link href="/onboarding/profile">
                <button className="flex items-center justify-center gap-2 bg-white text-[#111827] px-6 py-2.5 md:px-7 md:py-3 rounded-full border-[3px] border-[#111827] shadow-[4px_4px_0px_#111827] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#111827] transition-all font-bold text-base md:text-lg w-full sm:w-auto cursor-pointer">
                  BECOME A FREELANCER <ArrowRight />
                </button>
              </Link>
            </>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════
          ANIMATED HERO SCENE — FivePathways Rive Animation
          ══════════════════════════════════════════ */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none select-none z-10 hero-scene-fade flex items-end">
        <HeroRiveAnimation />
      </div>

    </div>
  );
}
