"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserButton, SignOutButton } from "@clerk/nextjs";

export default function ClientDashboardPage() {
  const profile = useQuery(api.clients.getProfile);
  const freelancerProfile = useQuery(api.freelancers.getProfile);
  const clientGigs = useQuery(api.gigs.getClientGigs);
  const unreadCount = useQuery(api.messages.getUnreadNotificationCount);
  const createGig = useMutation(api.gigs.createGig);
  const deleteGig = useMutation(api.gigs.deleteGig);
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [gigTitle, setGigTitle] = useState('');
  const [gigDesc, setGigDesc] = useState('');
  const [gigBudget, setGigBudget] = useState('');
  const [gigCategory, setGigCategory] = useState('');
  const [gigSkills, setGigSkills] = useState('');
  const [gigDeadline, setGigDeadline] = useState('');
  const [deletingGigId, setDeletingGigId] = useState<string | null>(null);

  const categories = [
    "Web Development",
    "Full Stack Development",
    "Frontend Development",
    "Backend Development",
    "App Development",
    "UI/UX Design",
    "Video Editing",
    "Animation",
    "Digital Marketing",
    "SEO & Content Writing",
    "Graphic Design",
    "Data Science & AI",
    "Other"
  ];

  const formatINR = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  const handlePostGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle || !gigDesc || !gigBudget) return;
    
    await createGig({
      title: gigTitle,
      description: gigDesc,
      budget: Number(gigBudget),
      category: gigCategory || undefined,
      skills: gigSkills
        ? gigSkills.split(',').map((skill) => skill.trim()).filter(Boolean)
        : undefined,
      deadline: gigDeadline || undefined,
    });
    
    setShowPostModal(false);
    setGigTitle('');
    setGigDesc('');
    setGigBudget('');
    setGigCategory('');
    setGigSkills('');
    setGigDeadline('');
  };

  return (
    <div className='bg-[#FAF7F2] text-[#111827] font-body selection:bg-[#143D30] flex min-h-screen relative'>
      {/* Post Gig Modal */}
      {showPostModal && (
        <div className='fixed inset-0 z-50 bg-[#111827]/50 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl relative'>
            <button onClick={() => setShowPostModal(false)} className='absolute top-4 right-4 text-neutral-500 hover:text-black'>
              <span className='material-symbols-outlined'>close</span>
            </button>
            <h2 className='text-2xl font-serif tracking-tight mb-4 text-[#111827]'>Post a New Gig</h2>
            <form onSubmit={handlePostGig} className='space-y-4'>
              <div>
                <label className='text-xs uppercase tracking-widest text-[#111827] mb-1 block'>Project Title</label>
                <input type='text' value={gigTitle} onChange={(e) => setGigTitle(e.target.value)} required className='w-full bg-white border border-[#111827]/10 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-[#111827]' placeholder='e.g. Next.js E-commerce Developer needed' />
              </div>
              <div>
                <label className='text-xs uppercase tracking-widest text-[#111827] mb-1 block'>Description</label>
                <textarea value={gigDesc} onChange={(e) => setGigDesc(e.target.value)} required rows={4} className='w-full bg-white border border-[#111827]/10 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-[#111827]' placeholder='Describe the scope of work...' />
              </div>
              <div>
                <label className='text-xs uppercase tracking-widest text-[#111827] mb-1 block'>Budget (₹)</label>
                <input type='number' min='500' value={gigBudget} onChange={(e) => setGigBudget(e.target.value)} required className='w-full bg-white border border-[#111827]/10 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-[#111827]' placeholder='e.g. 25000' />
              </div>
              <div>
                <label className='text-xs uppercase tracking-widest text-[#111827] mb-1 block'>Category</label>
                <select 
                  value={gigCategory} 
                  onChange={(e) => setGigCategory(e.target.value)} 
                  required
                  className='w-full bg-white border border-[#111827]/10 p-3 rounded-xl focus:ring-2 focus:ring-[#52c2ad]/50 outline-none text-[#111827] appearance-none cursor-pointer'
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='text-xs uppercase tracking-widest text-[#111827] mb-1 block'>Required Skills</label>
                <input type='text' value={gigSkills} onChange={(e) => setGigSkills(e.target.value)} className='w-full bg-white border border-[#111827]/10 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-[#111827]' placeholder='React, Next.js, Tailwind' />
              </div>
              <div>
                <label className='text-xs uppercase tracking-widest text-[#111827] mb-1 block'>Deadline</label>
                <input type='text' value={gigDeadline} onChange={(e) => setGigDeadline(e.target.value)} className='w-full bg-white border border-[#111827]/10 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-[#111827]' placeholder='e.g. 15 May 2026' />
              </div>
              <div className='flex gap-3 justify-end pt-4'>
                <button type='button' onClick={() => setShowPostModal(false)} className='px-5 py-2 rounded-xl text-[#111827] hover:bg-neutral-100 transition-colors border border-[#111827]/10 font-semibold'>Cancel</button>
                <button type='submit' className='px-5 py-2 bg-[#52c2ad] text-[#111827] font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#111827] border border-[#111827]/10 transition-all'>Post Gig</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Navigation Shell */}
      <nav className='fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#111827]/10 shadow-sm h-16 flex items-center'>
        <div className='flex justify-between items-center w-full px-6 max-w-7xl mx-auto'>
          <Link href='/' className='text-2xl font-medium tracking-tight text-[#111827] flex items-center gap-2'>
            <div className='w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500'></div>
            SKILLIFY
          </Link>
          <div className='flex items-center gap-6'>
            <div className='flex gap-4 items-center mr-2'>
              <Link href='/chat?role=client' className='relative text-neutral-600 hover:text-[#111827] cursor-pointer transition-colors text-xl' aria-label='Open messages'>
                <span className='material-symbols-outlined text-xl'>mail</span>
                {typeof unreadCount === 'number' && unreadCount > 0 && (
                  <span className='absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-4 text-center'>
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
            <div className='hidden md:flex items-center gap-3'>
              <Link href={freelancerProfile ? '/freelancer/dashboard' : '/onboarding/profile'} className='flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#111827]/10 shadow-sm text-sm font-medium text-[#111827] hover:bg-neutral-50 transition-all'>
                <span className='material-symbols-outlined text-base'>switch_account</span>
                Switch to Freelancer
              </Link>
              <button onClick={() => setShowPostModal(true)} className='flex items-center gap-2 px-5 py-2 bg-[#52c2ad] text-[#111827] font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#111827] border border-[#111827]/10 transition-all z-40'>
                <span className='material-symbols-outlined text-lg'>add</span>
                Post Gig
              </button>
              <div className="flex items-center justify-center p-0.5 rounded-full bg-white border border-[#111827]/10 shadow-sm ml-2">
                <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} userProfileMode="navigation" userProfileUrl="/onboarding/client" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside className='hidden md:flex flex-col w-64 border-r border-[#111827]/10 bg-white fixed h-[calc(100vh-64px)] top-16 py-8 px-4 z-30'>
        <div className='space-y-2'>
          <Link href='/onboarding/client' className='flex items-center gap-3 px-4 py-3 text-[#111827] hover:bg-[#FAF7F2] rounded-xl transition-all border border-transparent hover:border-[#111827]/10'>
            <span className='material-symbols-outlined text-lg'>domain</span>
            <span className='font-medium text-sm'>Company Profile</span>
          </Link>
          <Link href='/client/dashboard' className='flex items-center gap-3 px-4 py-3 bg-[#FAF7F2] text-[#111827] rounded-xl border border-[#111827]/10 shadow-[2px_2px_0px_#111827]'>
            <span className='material-symbols-outlined text-lg'>dashboard</span>
            <span className='font-medium text-sm'>Dashboard</span>
          </Link>
          <Link href='/chat?role=client' className='flex items-center gap-3 px-4 py-3 text-[#111827] hover:bg-[#FAF7F2] rounded-xl transition-all border border-transparent hover:border-[#111827]/10'>
            <span className='material-symbols-outlined text-lg'>chat_bubble</span>
            <span className='font-medium text-sm'>Messages</span>
            {typeof unreadCount === 'number' && unreadCount > 0 && (
              <span className='ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold'>
                {unreadCount}
              </span>
            )}
          </Link>
          <Link href='/payment' className='flex items-center gap-3 px-4 py-3 text-[#111827] hover:bg-[#FAF7F2] rounded-xl transition-all border border-transparent hover:border-[#111827]/10'>
            <span className='material-symbols-outlined text-lg'>payments</span>
            <span className='font-medium text-sm'>Payments</span>
          </Link>
        </div>
        <div className="pt-8 mt-auto border-t border-[#111827]/10">
          <SignOutButton redirectUrl="/">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200">
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="font-medium text-sm">Logout</span>
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className='flex-1 md:ml-64 pt-24 p-6 lg:p-12 relative overflow-hidden'>
        <div className='max-w-6xl mx-auto relative z-10'>
          <div className='mb-10 flex justify-between'>
            <div>
              <span className='text-[0.65rem] font-medium tracking-[0.15em] uppercase text-[#111827] mb-2 flex items-center gap-2'>
                <span className='w-1.5 h-1.5 bg-[#52c2ad] rounded-full mt-0.5'></span>
                Client Dashboard
              </span>
              <h1 className='text-3xl md:text-4xl font-serif tracking-tight text-[#111827]'>Welcome back, {profile?.contactName?.split(' ')[0] || 'Client'}</h1>
            </div>
            <button onClick={() => setShowPostModal(true)} className='md:hidden flex items-center gap-2 px-4 py-2 bg-[#52c2ad] text-[#111827] font-semibold rounded-xl hover:shadow-[2px_2px_0px_#111827] border border-[#111827]/10 transition-all z-40'>
              <span className='material-symbols-outlined text-lg'>add</span>
              Post Gig
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
            <div className='bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-between h-48 border border-[#111827]/10 hover:shadow-md transition-shadow'>
              <div>
                <span className='text-xs font-medium uppercase tracking-widest text-[#111827]'>Total Spent</span>
                <div className='text-4xl font-serif tracking-tight mt-3 text-[#111827]'>₹0</div>
              </div>
            </div>
            <div className='bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-between h-48 border border-[#111827]/10 hover:shadow-md transition-shadow'>
              <div>
                <span className='text-xs font-medium uppercase tracking-widest text-[#111827]'>Active Projects</span>
                <div className='text-4xl font-serif tracking-tight mt-3 text-[#111827]'>{clientGigs?.filter(g => g.status === 'in_progress').length || 0}</div>
              </div>
            </div>
            <div className='bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-between h-48 border border-[#111827]/10 hover:shadow-md transition-shadow'>
              <div>
                <span className='text-xs font-medium uppercase tracking-widest text-[#111827]'>Open Gigs</span>
                <div className='text-4xl font-serif tracking-tight mt-3 text-[#111827]'>{clientGigs?.filter(g => g.status === 'open').length || 0}</div>
              </div>
            </div>
          </div>

          <div className='bg-white p-8 rounded-2xl border border-[#111827]/10 shadow-sm'>
            <h2 className='text-xl font-medium text-[#111827] mb-6'>Your Posted Gigs</h2>
            <div className="space-y-4">
              {clientGigs === undefined ? (
                <p className='text-neutral-600'>Loading...</p>
              ) : clientGigs.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <span className='material-symbols-outlined text-4xl text-neutral-400 mb-4'>work</span>
                  <p className='text-[#111827] font-medium'>No gigs posted yet</p>
                  <button onClick={() => setShowPostModal(true)} className='mt-6 px-6 py-3 bg-[#111827] text-white rounded-xl text-sm font-semibold hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#52c2ad] transition-all border border-[#111827]/10'>Post Your First Gig</button>
                </div>
              ) : (
                clientGigs.map((gig) => (
                  <div key={gig._id} className='p-6 border border-[#111827]/10 bg-[#FAF7F2] rounded-xl hover:border-[#111827]/30 transition-colors relative group'>
                    <div className='flex justify-between items-start mb-2'>
                        <h3 className='font-semibold text-lg text-[#111827]'>{gig.title}</h3>
                        <span className='text-xs px-3 py-1 bg-white border border-[#111827]/10 shadow-[1px_1px_0px_#111827] rounded-md font-semibold tracking-widest uppercase'>{gig.status}</span>
                    </div>
                    <div className='flex flex-wrap gap-2 mb-3 text-xs'>
                      {gig.category && <span className='px-2 py-1 rounded-full bg-white border border-[#111827]/10 text-[#111827]'>{gig.category}</span>}
                      {gig.deadline && <span className='px-2 py-1 rounded-full bg-white border border-[#111827]/10 text-[#111827]'>Deadline: {gig.deadline}</span>}
                    </div>
                    <p className='text-sm text-[#111827]/80 line-clamp-2 mb-4'>{gig.description}</p>
                    {gig.skills && gig.skills.length > 0 && (
                      <div className='flex flex-wrap gap-2 mb-4'>
                        {gig.skills.map((skill) => (
                          <span key={skill} className='text-[11px] px-2 py-1 bg-white border border-[#111827]/10 rounded-md text-[#111827]'>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className='flex items-center justify-between mt-4 text-sm font-medium'>
                        <div className='flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-[#111827]/10 shadow-[1px_1px_0px_#111827]'>
                          <span className='text-[#111827]'>{formatINR(gig.budget)}</span>
                        </div>
                        {gig.status === 'open' && (
                          <Link href={`/client/gig/${gig._id}`} className='text-[#111827] bg-[#52c2ad] px-4 py-2 rounded-xl border border-[#111827]/10 shadow-[2px_2px_0px_#111827] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#111827] transition-all'>View Proposals &rarr;</Link>
                        )}
                        {gig.status === 'in_progress' && (
                          <div className="flex items-center gap-3">
                            <Link href="/chat?role=client" className="text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl hover:bg-indigo-100 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                              <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                              Open Chat
                            </Link>
                            <Link href={`/payment?amount=${gig.budget}&gigId=${gig._id}`} className='text-white bg-indigo-600 px-4 py-2 rounded-xl border border-[#111827]/10 shadow-[2px_2px_0px_#111827] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#111827] transition-all flex items-center gap-2'>
                              <span className="material-symbols-outlined text-[18px]">payments</span>
                              Pay
                            </Link>
                          </div>
                        )}
                        {gig.status === 'completed' && (
                          <span className='text-emerald-700 bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 font-semibold'>Completed</span>
                        )}
                        {deletingGigId === gig._id ? (
                          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                            <span className="text-xs font-bold text-red-600 uppercase tracking-tighter">Are you sure?</span>
                            <button 
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                try {
                                  await deleteGig({ gigId: gig._id });
                                  setDeletingGigId(null);
                                } catch (err) {
                                  alert("Error: " + (err as Error).message);
                                }
                              }}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                            >
                              Yes, Delete
                            </button>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeletingGigId(null);
                              }}
                              className="bg-neutral-200 text-[#111827] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-neutral-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeletingGigId(gig._id);
                            }} 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-all font-semibold flex items-center gap-1 border border-transparent hover:border-red-200 group/del"
                          >
                            <span className="material-symbols-outlined text-sm group-hover/del:scale-110 transition-transform">delete</span>
                            <span className="text-xs">Delete</span>
                          </button>
                        )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}