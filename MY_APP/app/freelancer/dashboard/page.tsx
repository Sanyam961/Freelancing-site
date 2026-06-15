"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UserButton, SignOutButton } from "@clerk/nextjs";

export default function FreelancerDashboardPage() {
  const profile = useQuery(api.freelancers.getProfile);
  const clientProfile = useQuery(api.clients.getProfile);
  const openGigs = useQuery(api.gigs.getOpenGigs);
  const myProposals = useQuery(api.proposals.getFreelancerProposals);
  const unreadCount = useQuery(api.messages.getUnreadNotificationCount);
  const createProposal = useMutation(api.proposals.createProposal);

  const [selectedGigId, setSelectedGigId] = useState<Id<"gigs"> | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [price, setPrice] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");

  const formatINR = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const activeProposalsCount = myProposals?.filter(p => p.status === 'pending').length || 0;
  
  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGigId || !coverLetter || !price) return;
    
    try {
      await createProposal({
        gigId: selectedGigId,
        coverLetter: coverLetter,
        price: Number(price),
        estimatedDays: estimatedDays ? Number(estimatedDays) : undefined,
      });
      alert("Proposal submitted successfully!");
      setSelectedGigId(null);
      setCoverLetter("");
      setPrice("");
      setEstimatedDays("");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#111827] font-body selection:bg-[#143D30] text-[#111827] flex min-h-screen relative">
      {/* Proposal Modal */}
      {selectedGigId && (
        <div className="fixed inset-0 z-50 bg-[#111827]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl relative border border-[#111827]/10 text-[#111827]">
            <button onClick={() => setSelectedGigId(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-black">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-2xl font-serif tracking-tight mb-4">Submit Proposal</h2>
            <form onSubmit={handlePropose} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-[#111827] mb-1 block">Cover Letter</label>
                <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} required rows={5} className="w-full bg-white border border-[#111827]/10 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm placeholder:text-neutral-400" placeholder="Why are you a great fit?" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-[#111827] mb-1 block">Your Price (₹)</label>
                <input type="number" min="500" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full bg-white border border-[#111827]/10 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm placeholder:text-neutral-400" placeholder="e.g. 25000" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-[#111827] mb-1 block">Estimated Days</label>
                <input type="number" min="1" value={estimatedDays} onChange={(e) => setEstimatedDays(e.target.value)} className="w-full bg-white border border-[#111827]/10 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm placeholder:text-neutral-400" placeholder="e.g. 14" />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setSelectedGigId(null)} className="px-5 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#52c2ad] text-[#111827] font-semibold flex items-center rounded-xl hover:-translate-y-0.5 shadow-[2px_2px_0px_#111827] hover:shadow-[3px_3px_0px_#111827] border border-[#111827]/10 transition-all text-sm">Send Proposal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Navigation Shell */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border border-[#111827]/10 shadow-sm border-b border-[#111827]/10 h-16 flex items-center backdrop-blur-xl">
        <div className="flex justify-between items-center w-full px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-8 md:gap-12">
            <Link href="/" className="text-2xl font-medium tracking-tight text-[#111827] flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
              SKILLIFY
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4 items-center mr-2">
              <Link href="/chat?role=freelancer" className="relative text-neutral-600 hover:text-[#111827] cursor-pointer transition-colors text-xl" aria-label="Open messages">
                <span className="material-symbols-outlined text-xl">mail</span>
                {typeof unreadCount === "number" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
            <div className="flex items-center justify-center p-0.5 rounded-full bg-white border border-[#111827]/10 shadow-sm">
              <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} userProfileMode="navigation" userProfileUrl="/onboarding/profile" />
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed top-16 right-6 z-30">
        <Link
          href={clientProfile ? "/client/dashboard" : "/onboarding/client"}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#111827]/10 shadow-sm text-sm font-medium text-[#111827] hover:-translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined text-base">switch_account</span>
          Switch to Client
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#111827]/10 bg-white fixed h-[calc(100vh-64px)] top-16 py-8 px-4 z-40">
        <div className="space-y-1">
          <Link href="/onboarding/profile" className="flex items-center gap-3 px-4 py-3 text-[#111827] hover:bg-[#FAF7F2] rounded-xl transition-all border border-transparent hover:border-[#111827]/10">
            <span className="material-symbols-outlined text-lg">badge</span>
            <span className="font-medium text-sm">Profile Details</span>
          </Link>
          <Link href="/freelancer/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#FAF7F2] text-[#111827] rounded-xl border border-[#111827]/10 shadow-[2px_2px_0px_#111827]">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href='/chat?role=freelancer' className='flex items-center gap-3 px-4 py-3 text-[#111827] hover:bg-[#FAF7F2] rounded-xl transition-all border border-transparent hover:border-[#111827]/10'>
            <span className='material-symbols-outlined text-lg'>chat_bubble</span>
            <span className='font-medium text-sm'>Messages</span>
          </Link>
          <Link href='/payment' className='flex items-center gap-3 px-4 py-3 text-[#111827] hover:bg-[#FAF7F2] rounded-xl transition-all border border-transparent hover:border-[#111827]/10'>
            <span className='material-symbols-outlined text-lg'>payments</span>
            <span className='font-medium text-sm'>Payments</span>
          </Link>
        </div>
        <div className="pt-8 mt-auto border-t border-[#111827]/10">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#111827] hover:bg-neutral-100 rounded-xl transition-all border border-transparent hover:border-[#111827]/10">
            <span className="material-symbols-outlined text-lg">settings</span>
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <SignOutButton redirectUrl="/">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200 mt-2">
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="font-medium text-sm">Logout</span>
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 pt-24 p-6 lg:p-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Page Header */}
          <div className="mb-10">
            <span className="text-[0.65rem] font-medium tracking-[0.15em] uppercase text-[#111827] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#52c2ad] font-medium rounded-full mt-0.5"></span>
              Dashboard Overview
            </span>
            <h1 className="text-3xl font-serif tracking-tight md:text-4xl text-[#111827]">Welcome back, {profile?.fullName?.split(" ")[0] || "Freelancer"}</h1>
          </div>

          {/* Bento Grid Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-between h-48 border border-[#111827]/10 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <div>
                <span className="text-xs font-medium uppercase tracking-widest text-[#111827]">Earnings this month</span>
                <div className="text-4xl font-serif tracking-tight mt-3 text-[#111827]">₹0</div>
              </div>
              <div className="flex items-center text-[#111827] text-xs font-medium gap-1 bg-[#FAF7F2] w-fit px-2 py-1 rounded-md border border-[#111827]/10">
                <span>No earnings yet</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-between h-48 border border-[#111827]/10 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
              <div>
                <span className="text-xs font-medium uppercase tracking-widest text-[#111827]">Active Proposals</span>
                <div className="text-4xl font-serif tracking-tight mt-3 text-[#111827]">{activeProposalsCount}</div>
              </div>
              <div className="flex items-center text-[#111827] text-xs font-medium gap-1 bg-[#FAF7F2] w-fit px-2 py-1 rounded-md border border-[#111827]/10">
                <span>Waiting for clients</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-between h-48 border border-[#111827]/10 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
              <div>
                <span className="text-xs font-medium uppercase tracking-widest text-[#111827]">Profile Views</span>
                <div className="text-4xl font-serif tracking-tight mt-3 text-[#111827]">12</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Open Gigs Marketplace */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-[#111827]">Explore Open Gigs</h2>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-[#111827]/10 shadow-sm flex flex-col min-h-48">
                {openGigs === undefined ? (
                  <p className="text-neutral-600">Loading marketplace...</p>
                ) : openGigs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-neutral-400 mb-4">search_off</span>
                    <p className="text-[#111827] font-medium">No open gigs at the moment.</p>
                    <p className="text-xs text-neutral-600 mt-2">Clients are currently crafting their requests.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {openGigs.map(gig => (
                      <div key={gig._id} className="p-5 border border-[#111827]/10 rounded-xl bg-[#FAF7F2] hover:border-[#111827]/30 transition-all flex flex-col">
                        <div className="flex justify-between items-start mb-2 text-[#111827]">
                          <h3 className="font-semibold text-lg font-serif">{gig.title}</h3>
                          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-500/20">{formatINR(gig.budget)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3 text-[11px]">
                          {gig.client?.companyName && <span className="px-2 py-1 rounded-full bg-white border border-[#111827]/10 text-[#111827]">{gig.client.companyName}</span>}
                          {gig.category && <span className="px-2 py-1 rounded-full bg-white border border-[#111827]/10 text-[#111827]">{gig.category}</span>}
                          {gig.deadline && <span className="px-2 py-1 rounded-full bg-white border border-[#111827]/10 text-[#111827]">Deadline: {gig.deadline}</span>}
                        </div>
                        <p className="mb-4 text-sm text-[#111827]/70 line-clamp-3">{gig.description}</p>
                        {gig.skills && gig.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {gig.skills.map((skill) => (
                              <span key={skill} className="text-[11px] px-2 py-1 bg-white border border-[#111827]/10 rounded-md text-[#111827]">{skill}</span>
                            ))}
                          </div>
                        )}
                        <div className="mt-auto self-end">
                           <button onClick={() => setSelectedGigId(gig._id)} className="px-5 py-2 rounded-lg bg-[#52c2ad] text-[#111827] font-semibold text-sm shadow-[2px_2px_0px_#111827] border border-[#111827]/10 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#111827] transition-all">Submit Proposal &rarr;</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Your Proposals Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-[#111827]">Your Proposals</h2>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-[#111827]/10 shadow-sm flex flex-col min-h-64">
                 {myProposals === undefined ? (
                   <div className="flex items-center justify-center h-48">
                     <span className="material-symbols-outlined animate-spin text-neutral-400">refresh</span>
                   </div>
                 ) : myProposals.length === 0 ? (
                   <div className="flex flex-col items-center text-center justify-center py-10 h-full text-neutral-600">
                     <span className="material-symbols-outlined text-4xl mb-4 opacity-20">description</span>
                     <p className="font-medium text-[#111827]">No proposals submitted</p>
                   </div>
                 ) : (
                   <div className="flex flex-col h-full">
                     {/* Active Proposals */}
                     <div className="mb-6">
                       <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-500 mb-4 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                         Active & Pending
                       </h3>
                       <div className="space-y-3">
                         {myProposals.filter(p => p.status === 'pending').length === 0 && (
                           <p className="text-xs text-neutral-400 italic py-2">No pending proposals</p>
                         )}
                         {myProposals.filter(p => p.status === 'pending').map(proposal => (
                           <div key={proposal._id} className="p-4 rounded-xl bg-[#FAF7F2]/50 border border-[#111827]/5 hover:border-[#111827]/10 transition-all">
                             <div className="flex justify-between items-start mb-2">
                               <h4 className="font-bold text-sm text-[#111827] line-clamp-1">{proposal.gig?.title}</h4>
                               <span className="text-[9px] font-black uppercase tracking-tighter text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">Pending</span>
                             </div>
                             <div className="flex justify-between items-center mt-3">
                               <span className="text-[11px] font-bold text-[#111827]">{formatINR(proposal.price)}</span>
                               <span className="text-[10px] text-neutral-500">{proposal.estimatedDays} days</span>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>

                     {/* Past/Accepted Proposals */}
                     <div>
                       <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-600 mb-4 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                         Decided & Closed
                       </h3>
                       <div className="space-y-3">
                         {myProposals.filter(p => p.status !== 'pending').length === 0 && (
                           <p className="text-xs text-neutral-400 italic py-2">No past history</p>
                         )}
                         {myProposals.filter(p => p.status !== 'pending').map(proposal => (
                           <div key={proposal._id} className={`p-4 rounded-xl border transition-all ${proposal.status === 'accepted' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-neutral-50 border-neutral-200 opacity-75'}`}>
                             <div className="flex justify-between items-start mb-2">
                               <h4 className="font-bold text-sm text-[#111827] line-clamp-1">{proposal.gig?.title}</h4>
                               <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${
                                 proposal.status === 'accepted' ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 'text-neutral-600 bg-neutral-200 border-neutral-300'
                               }`}>{proposal.status}</span>
                             </div>
                             
                             {proposal.status === "accepted" && (
                               <div className="mt-4 flex items-center justify-between gap-4">
                                 <div className="flex flex-col">
                                   <span className="text-[10px] text-neutral-500 uppercase tracking-tight">Agreed Price</span>
                                   <span className="text-xs font-bold">{formatINR(proposal.price)}</span>
                                 </div>
                                 <Link 
                                   href="/chat?role=freelancer" 
                                   className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#143D30] text-white rounded-lg text-[11px] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[2px_2px_0px_#111827]"
                                 >
                                   <span className="material-symbols-outlined text-sm">chat_bubble</span>
                                   CHAT NOW
                                 </Link>
                               </div>
                             )}
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 )}
              </div>
            </div>
          </div>

          {/* Recent Payments Received Section */}
          <div className="mt-12 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-[#111827]">Payments Received</h2>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline">View All History &rarr;</button>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-[#111827]/10 shadow-sm flex flex-col">
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="material-symbols-outlined text-4xl text-neutral-300 mb-4">payments</span>
                <p className="font-medium text-[#111827]">No payments received yet</p>
                <p className="text-xs text-neutral-500 mt-2">When clients complete milestones, your payments will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}