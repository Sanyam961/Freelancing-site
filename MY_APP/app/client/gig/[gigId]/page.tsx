"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';

export default function GigDetailsPage() {
  const { gigId } = useParams();
  const router = useRouter();
  
  const proposals = useQuery(api.proposals.getGigProposals, { gigId: gigId as Id<"gigs"> });
  const acceptProposal = useMutation(api.proposals.acceptProposal);

  const formatINR = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  const handleAccept = async (proposalId: Id<"proposals">) => {
    try {
      const result = await acceptProposal({ proposalId });
      alert("Proposal accepted! You can now chat with the freelancer.");
      router.push(`/chat?conversationId=${result.conversationId}&role=client`);
    } catch (err) {
      console.error(err);
      alert("Failed to accept proposal.");
    }
  };

  return (
    <div className='bg-[#FAF7F2] text-[#111827] font-body selection:bg-[#143D30] min-h-screen'>
      <nav className='bg-white border-b border-[#111827]/10 h-16 flex items-center px-6 max-w-6xl mx-auto'>
        <Link href='/client/dashboard' className='text-sm font-medium hover:underline'>&larr; Back to Dashboard</Link>
      </nav>
      <main className='max-w-4xl mx-auto p-6 md:p-12'>
        <h1 className='text-3xl font-serif mb-8'>Proposals</h1>
        
        {proposals === undefined ? (
          <p>Loading...</p>
        ) : proposals.length === 0 ? (
          <div className='bg-white p-12 border border-[#111827]/10 rounded-2xl text-center shadow-sm'>
            <p className='text-[#111827] font-medium'>No proposals yet.</p>
            <p className='text-sm text-neutral-600 mt-2'>Freelancers haven&apos;t submitted anything for this project.</p>
          </div>
        ) : (
          <div className='space-y-6'>
            {proposals.map(proposal => (
              <div key={proposal._id} className='bg-white p-6 border border-[#111827]/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex items-center gap-4'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={proposal.freelancer?.photoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBlVJxtvwlyVaE0AD-FXJQTOKaQFTebBzNCgONJ5fKwV2XyCVR3ebyWc0SitS5y_85BMBuZ2r6T6L0sIDxKbjMDF5lMLuo6ufPaHq6N5tuc6MqPaWrc8sW1Vh6ad1ZcfZPqmap8UDcNR9hrbBx81xvj1BDA1ExO8nCW3rTksKrtH7nYG98_HDmRGC1U26Bf3rp2ncMA7WtCMz-RvnFriQrn-S148ruVU-Usx7r0ESfyFgG7Rkzh6KC70cAJxATy412zwYu6E2u5UA"} alt="Freelancer" className='w-12 h-12 rounded-full border border-[#111827]/10 object-cover'/>
                    <div>
                      <h3 className='font-semibold text-lg'>{proposal.freelancer?.fullName || "Freelancer"}</h3>
                      <p className='text-xs text-neutral-600 uppercase tracking-widest'>{proposal.freelancer?.title || "Professional"}</p>
                    </div>
                  </div>
                  <div className='bg-[#FAF7F2] border border-[#111827]/10 px-3 py-1 rounded-md text-sm font-semibold shadow-[1px_1px_0px_#111827]'>
                    {formatINR(proposal.price)}
                  </div>
                </div>
                <div className='flex flex-wrap gap-2 mb-4 text-xs'>
                  {proposal.freelancer?.title && <span className='px-2 py-1 rounded-full bg-white border border-[#111827]/10 text-[#111827]'>{proposal.freelancer.title}</span>}
                  {proposal.estimatedDays && <span className='px-2 py-1 rounded-full bg-white border border-[#111827]/10 text-[#111827]'>{proposal.estimatedDays} day delivery</span>}
                </div>
                <div className='bg-[#FAF7F2]/50 p-4 rounded-xl border border-[#111827]/5 text-sm leading-relaxed mb-4'>
                  {proposal.coverLetter}
                </div>
                <div className='flex justify-end gap-3'>
                  {proposal.status === "pending" ? (
                    <button onClick={() => handleAccept(proposal._id)} className='bg-[#52c2ad] text-[#111827] px-5 py-2 rounded-xl text-sm font-semibold border border-[#111827]/10 shadow-[2px_2px_0px_#111827] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#111827] transition-all'>
                      Accept Proposal
                    </button>
                  ) : (
                    <span className='px-4 py-2 font-medium uppercase tracking-widest text-[#111827] text-xs bg-emerald-100 rounded-lg'>Accepted - chat opened</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}