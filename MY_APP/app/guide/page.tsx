"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, MessageSquare, FolderOpen, BadgeCheck, Clock3, Users } from "lucide-react";

function StepCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-[#111827]/10 bg-white p-8 shadow-[4px_4px_0px_#111827]">
      <Icon className="h-10 w-10 text-[#42A596]" />
      <h3 className="mt-6 text-xl font-bold uppercase tracking-widest text-[#111827]">{title}</h3>
      <p className="mt-3 text-neutral-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#111827]">
      <header className="border-b border-[#111827]/10 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[#111827]/10 bg-white px-4 py-2 text-sm font-bold uppercase tracking-widest shadow-sm transition-colors hover:bg-[#f6f2e8]">
            <ArrowLeft className="h-4 w-4" /> Back Home
          </Link>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#111827]/70">My Guide</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <section className="max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#111827]/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] shadow-sm">
            How Skillify Works
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-serif tracking-tight leading-[1.05]">
            A simple guide for clients and freelancers.
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-neutral-600">
            Use Skillify to post projects, send proposals, accept work, and chat in one place. This page explains what each side can do and how to move through the site.
          </p>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          <StepCard
            icon={ClipboardList}
            title="1. Create a Profile"
            description="Freelancers set up their skills, title, and bio. Clients add company details so they can start hiring right away."
          />
          <StepCard
            icon={FolderOpen}
            title="2. Post or Browse"
            description="Clients post a gig with budget, skills, category, and deadline. Freelancers browse open gigs and choose the right fit."
          />
          <StepCard
            icon={MessageSquare}
            title="3. Propose and Chat"
            description="Freelancers send a proposal with a cover letter and price. Clients accept the best match and start chatting immediately."
          />
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[#111827]/10 bg-white p-8 shadow-[4px_4px_0px_#111827]">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-8 w-8 text-[#42A596]" />
              <h2 className="text-2xl font-serif">What a client can do</h2>
            </div>
            <ul className="mt-6 space-y-4 text-neutral-700 leading-relaxed list-disc pl-5">
              <li>Post a new project with a clear budget in rupees.</li>
              <li>Choose skills, category, and deadline so the right freelancers see it.</li>
              <li>Review proposals, accept one, and open direct chat with the freelancer.</li>
              <li>Track project status from open to in progress as work begins.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-[#111827]/10 bg-[#111827] p-8 text-white shadow-[4px_4px_0px_#e5a09c]">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-[#70D7C9]" />
              <h2 className="text-2xl font-serif">What a freelancer can do</h2>
            </div>
            <ul className="mt-6 space-y-4 leading-relaxed text-gray-300 list-disc pl-5">
              <li>Fill in a profile that highlights skills, location, and experience.</li>
              <li>Browse open gigs from clients and submit a proposal.</li>
              <li>Set a price and estimated delivery time for every proposal.</li>
              <li>Chat with the client after acceptance and keep the project moving.</li>
            </ul>
          </div>
        </section>

        <section className="mt-14 rounded-[2rem] border border-[#111827]/10 bg-[#f7efe1] p-8 md:p-10 shadow-[4px_4px_0px_#111827]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Clock3 className="h-8 w-8 text-[#f2a642]" />
                <h2 className="text-2xl font-serif">How to move through the site</h2>
              </div>
              <p className="mt-4 max-w-3xl text-neutral-700 leading-relaxed">
                Start on the homepage, choose your path, complete onboarding, then use your dashboard to post work or find it. When a proposal is accepted, both sides are routed into chat so the project can continue without switching apps.
              </p>
            </div>
            <Link href="/" className="inline-flex items-center justify-center rounded-full border-2 border-[#111827] bg-[#70D7C9] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#111827] transition-colors hover:bg-white">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}