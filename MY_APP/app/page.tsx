"use client";

import { useUser, Show } from "@clerk/nextjs";
import LandingPage from "@/components/LandingPage";
import Features from "@/components/Features";
import Services from "@/components/Services";
import { LayoutDashboard, Briefcase, Users, PieChart, ArrowRight, Target, Globe, Zap } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import SimpleRiveAnimation from "@/components/SimpleRiveAnimation";

function AuthenticatedHome() {
  const { user } = useUser();
  const userRole = useQuery(api.users.getUserRole);

  if (userRole === undefined) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-transparent pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-3xl font-serif tracking-tight text-[#111827] mb-2 uppercase tracking-tight">
            Welcome back, <span className="text-[#143D30]">{user?.firstName || "Professional"}</span>
          </h1>
          <p className="text-neutral-600">
            {userRole === null 
              ? "Choose how you would like to use SKILLIFY to get started." 
              : "Here's what's happening with your projects today."}
          </p>
        </header>

        {userRole === null ? (
          /* NO ROLE: Show onboarding role selection */
          <div className="flex flex-col sm:flex-row gap-8 mb-12 justify-center mt-8">
            <Link 
              href="/onboarding/profile" 
              className="flex flex-col items-center justify-center p-10 bg-white border border-[#111827]/10 shadow-sm rounded-2xl hover:border-[#111827]/10 hover:bg-white border border-[#111827]/10 shadow-sm transition-all group w-72 shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#143D30] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl text-[#143D30]">
                  work
                </span>
              </div>
              <h2 className="text-xl font-medium text-[#111827] mb-2">I am a Freelancer</h2>
              <p className="text-sm text-neutral-600 text-center leading-relaxed">Find amazing projects and build your freelance career.</p>
            </Link>

            <Link 
              href="/onboarding/client" 
              className="flex flex-col items-center justify-center p-10 bg-white border border-[#111827]/10 shadow-sm rounded-2xl hover:border-purple-500/50 hover:bg-white border border-[#111827]/10 shadow-sm transition-all group w-72 shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#E5DFD3]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl font-serif tracking-tight text-[#111827]">
                  business
                </span>
              </div>
              <h2 className="text-xl font-medium text-[#111827] mb-2">I am a Client</h2>
              <p className="text-sm text-neutral-600 text-center leading-relaxed">Hire top-tier talent for your next big project.</p>
            </Link>
          </div>
        ) : (
          /* HAS ROLE: Show Stats and Dashboard Link */
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 rounded-2xl bg-white border border-[#111827]/10 shadow-sm shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-[#143D30] text-white  text-[#143D30]">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-medium text-[#111827]0">Active Proposals</div>
                </div>
                <div className="text-3xl font-serif tracking-tight text-[#111827]">0</div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#111827]/10 shadow-sm shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-[#E5DFD3]/20 text-[#111827]">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-medium text-[#111827]0">Current Contracts</div>
                </div>
                <div className="text-3xl font-serif tracking-tight text-[#111827]">0</div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#111827]/10 shadow-sm shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-[#143D30] text-white/20 text-[#111827]">
                    <PieChart className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-medium text-[#111827]0">Earnings (MTD)</div>
                </div>
                <div className="text-3xl font-serif tracking-tight text-[#111827]">₹0</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-white border border-[#111827]/10 shadow-sm h-96 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-white border border-[#111827]/10 shadow-sm rounded-full flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-medium text-[#111827] mb-2">Ready to find more work?</h3>
                <p className="text-[#111827]0 mb-8 max-w-sm">
                  Head over to your personalized dashboard to manage your projects.
                </p>
                <Link href="/dashboard" className="px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="p-8 rounded-2xl bg-[#E5DFD3]/20 border border border-[#111827]/10 h-96 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-medium text-[#111827] mb-4">SKILLIFY News</h3>
                  <p className="text-neutral-600 text-sm mb-4">
                    Welcome to SKILLIFY! Start exploring top talent and building the next big thing. Our team is constantly working behind the scenes to deliver the best matching experience. Check back here for future product updates!
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#143D30] text-white  border border border-[#111827]/10 text-[#143D30] text-xs font-mono">
                  [SYSTEM_LOG] Welcome to your new workspace.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <>
      <Show when="signed-out">
        <LandingPage />
        
        {/* My Guide Section - Moved here */}
        <section className="border-t border-[#111827]/10 bg-[#FFFDF5] px-6 py-20 md:py-28 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none -mt-20 -mr-20">
            <SimpleRiveAnimation src="/compass.riv" />
          </div>
          
          <div className="mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#111827]/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#111827] shadow-sm">
                My Guide
              </span>
              <h2 className="mt-6 text-4xl md:text-5xl font-serif tracking-tight text-[#111827] leading-[1.05]">
                Learn how clients and freelancers use Skillify.
              </h2>
              <p className="mt-6 max-w-xl text-lg md:text-xl text-neutral-600 leading-relaxed">
                Clients can post jobs, review proposals, accept work, and chat with freelancers. Freelancers can build a profile, find open gigs, send proposals, and manage conversations from the dashboard.
              </p>
              
              <div className="mt-10 flex justify-start">
                <Link href="/guide" className="inline-flex items-center justify-center rounded-full border-2 border-[#111827] bg-[#70D7C9] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#111827] transition-colors hover:bg-white shadow-[4px_4px_0px_#111827] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                  Open Full Guide
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <div className="w-full h-[400px]">
                <SimpleRiveAnimation src="/virtual-office.riv" />
              </div>
            </div>
          </div>
        </section>

        <Services />
        
        {/* Features Section - Moved here */}
        <Features />

        <section className="relative overflow-hidden border-t border-[#111827]/10 bg-white px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="max-w-3xl flex-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#111827]/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#111827] shadow-sm">
                  About Skillify
                </span>
                <h2 className="mt-6 text-4xl md:text-6xl font-serif tracking-tight text-[#111827] leading-[1.05]">
                  A better way for clients and freelancers to work together.
                </h2>
                <p className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-600 leading-relaxed">
                  Skillify brings posting, proposals, payments, and chat into one focused workspace so teams can move from idea to delivery without friction.
                </p>
              </div>
              <div className="flex-1 w-full max-w-md h-[350px] relative">
                <SimpleRiveAnimation src="/question-jar.riv" />
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-[#111827]/10 bg-white p-8 shadow-[4px_4px_0px_#111827]">
                <Target className="h-10 w-10 text-[#42A596]" />
                <h3 className="mt-6 text-xl font-bold uppercase tracking-widest text-[#111827]">Focused Matching</h3>
                <p className="mt-3 text-neutral-600 leading-relaxed">Post a project with the exact skills, budget, and deadline you need.</p>
              </div>
              <div className="rounded-3xl border border-[#111827]/10 bg-white p-8 shadow-[4px_4px_0px_#111827]">
                <Zap className="h-10 w-10 text-[#f2a642]" />
                <h3 className="mt-6 text-xl font-bold uppercase tracking-widest text-[#111827]">Instant Collaboration</h3>
                <p className="mt-3 text-neutral-600 leading-relaxed">Proposals, acceptances, and messages stay in one clear flow from first reply to final handoff.</p>
              </div>
              <div className="rounded-3xl border border-[#111827]/10 bg-white p-8 shadow-[4px_4px_0px_#111827]">
                <Globe className="h-10 w-10 text-[#42A596]" />
                <h3 className="mt-6 text-xl font-bold uppercase tracking-widest text-[#111827]">Built for Growth</h3>
                <p className="mt-3 text-neutral-600 leading-relaxed">Designed to help clients scale faster and freelancers show real work with clarity.
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4 rounded-[2rem] border border-[#111827]/10 bg-[#111827] p-8 md:flex-row md:items-center md:justify-between md:p-10 shadow-[8px_8px_0px_#e5a09c]">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-white">See the full story on the About page.</h3>
                <p className="mt-2 max-w-2xl text-sm md:text-base text-gray-300">
                  Learn how Skillify helps clients post work, freelancers send proposals, and both sides collaborate in one workspace.
                </p>
              </div>
              <Link href="/about" className="inline-flex items-center justify-center rounded-full border-2 border-white bg-[#70D7C9] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#111827] transition-colors hover:bg-white">
                Open About Page
              </Link>
            </div>
          </div>
        </section>
      </Show>

      <Show when="signed-in">
        <AuthenticatedHome />
      </Show>
    </>
  );
}
