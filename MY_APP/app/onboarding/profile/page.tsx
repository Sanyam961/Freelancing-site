"use client";

import { SignOutButton } from "@clerk/nextjs";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function FreelancerProfilePage() {
  const router = useRouter();
  const generateUploadUrl = useMutation(api.freelancers.generateUploadUrl);
  const saveProfile = useMutation(api.freelancers.saveProfile);
  const profile = useQuery(api.freelancers.getProfile);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setTitle(profile.title || "");
      setLocation(profile.location || "");
      setBio(profile.bio || "");
      setSkills(profile.skills || "");
      if (profile.photoUrl) {
        setImagePreview(profile.photoUrl);
      }
    }
  }, [profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      let photoId = profile?.photoId;

      if (imageFile) {
        // 1. Get short-lived upload URL
        const uploadUrlResponse = await generateUploadUrl();
        const postUrl = typeof uploadUrlResponse === 'string' ? uploadUrlResponse : uploadUrlResponse as string;
        // 2. POST the file to the URL
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const { storageId } = await result.json();
        photoId = storageId;
      }

      // 3. Save profile
      const args = {
        fullName,
        title,
        location,
        bio,
        skills,
        photoId: photoId || undefined,
      };
      await saveProfile(args);
      router.push("/freelancer/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-transparent text-[#111827] font-body selection:bg-[#143D30] text-white   flex min-h-screen">
      {/* SideNavBar Component - Premium Dark Theme */}
      <aside className="hidden md:flex flex-col h-screen w-64 border-r border-[#111827]/10/10 bg-white border border-[#111827]/10 shadow-sm py-8 px-4 fixed left-0 top-0 z-40">
        <div className="mb-12 px-2 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
          <h1 className="text-2xl font-medium tracking-tight text-[#111827]">SKILLIFY</h1>
        </div>

        <div className="mb-8 px-2">
          <div className="flex items-center gap-3 mb-2 bg-white border border-[#111827]/10 shadow-sm p-3 rounded-2xl border border-[#111827]/10 shadow-lg">
            <div className="overflow-hidden">
              <p className="text-[0.65rem] font-medium uppercase tracking-widest text-[#143D30] truncate">Setup Profile</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <Link href="/onboarding/profile" className="flex items-center gap-3 px-3 py-3 text-[#143D30] bg-[#143D30] text-white  border-r-2 border-indigo-500 transition-all rounded-l-xl group relative left-1">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
            <span className="uppercase tracking-[0.05em] text-[0.65rem] font-medium">Profile Details</span>
          </Link>

          <Link href="/freelancer/dashboard" className="flex items-center gap-3 px-3 py-3 text-[#111827] hover:bg-white/5 hover:text-[#111827] rounded-xl transition-all group">
            <span className="material-symbols-outlined text-lg group-hover:text-[#143D30] transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="uppercase tracking-[0.05em] text-[0.65rem] font-medium">Dashboard</span>
          </Link>
        </nav>
        <div className="pt-8 mt-auto border-t border-[#111827]/10/10">
          <SignOutButton redirectUrl="/">
            <button className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all group">
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="uppercase tracking-[0.05em] text-[0.65rem] font-medium">Logout</span>
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 bg-transparent min-h-screen relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#143D30] text-white  rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Navigation (Mobile & Shell Branding) */}
        <header className="sticky top-0 w-full z-30 px-6 md:px-12 py-6 flex justify-between items-center bg-transparent/80 backdrop-blur-2xl border-b border-[#111827]/10/10">
          <div>
            <span className="text-[0.65rem] font-medium uppercase tracking-widest text-[#111827] mb-1 block">Onboarding Journey</span>
            <h2 className="text-2xl md:text-3xl font-serif tracking-tight tracking-tight text-[#111827]">Profile Details</h2>
          </div>
        </header>

        {/* Profile Form Section */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 py-12 relative z-10">
          <div className="bg-white border border-[#111827]/10 shadow-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-[#111827]/10 relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-transparent"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Profile Picture Upload Area */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-48 h-48 rounded-full bg-white border border-[#111827]/10 shadow-sm flex items-center justify-center border border-dashed border-white/20 overflow-hidden relative transition-all group-hover:border-[#111827]/10">
                    {imagePreview ? (
                       // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl font-serif tracking-tight text-neutral-600 group-hover:text-[#143D30] transition-colors">add_a_photo</span>
                    )}
                    {/* Hidden overlay for interactivity simulation */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <span className="text-[0.65rem] font-medium text-[#111827] uppercase tracking-widest flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-2xl">upload</span>
                        Upload Photo
                      </span>
                    </div>
                  </div>
                  <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#111827] border border-[#111827]/10 text-[#111827] shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#143D30] text-white border border-[#111827]/10 shadow-sm font-medium group-hover:border-[#111827]/10 transition-all pointer-events-none">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium text-[#111827]">Professional Headshot</p>
                  <p className="text-[0.65rem] text-[#111827] mt-1 uppercase tracking-widest">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </div>

              {/* Input Fields Area */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-600 block ml-1">Full Name</label>
                    <input
                      className="w-full bg-white border border-[#111827]/10 shadow-sm rounded-xl px-4 py-4 text-[#111827] placeholder:text-neutral-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-sm"
                      placeholder="e.g. Julianne Sterling"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  {/* Professional Title */}
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-600 block ml-1">Professional Title</label>
                    <input
                      className="w-full bg-white border border-[#111827]/10 shadow-sm rounded-xl px-4 py-4 text-[#111827] placeholder:text-neutral-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-sm"
                      placeholder="e.g. Senior Creative Director"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-600 block ml-1">Location</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#111827] text-xl">location_on</span>
                    <input
                      className="w-full bg-white border border-[#111827]/10 shadow-sm rounded-xl pl-12 pr-4 py-4 text-[#111827] placeholder:text-neutral-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-sm"
                      placeholder="e.g. London, United Kingdom"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-600">Core Skills</label>
                  </div>
                  <input
                    className="w-full bg-white border border-[#111827]/10 shadow-sm rounded-xl px-4 py-4 text-[#111827] placeholder:text-neutral-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-sm"
                    placeholder="e.g. UX Design, React, Copywriting (comma separated)"
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-600">Short Bio</label>
                    <span className="text-[0.65rem] font-medium text-neutral-600 tracking-wider">{bio.length} / 260</span>
                  </div>
                  <textarea
                    className="w-full bg-white border border-[#111827]/10 shadow-sm rounded-xl px-4 py-4 text-[#111827] placeholder:text-neutral-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none resize-none text-sm leading-relaxed"
                    placeholder="Briefly describe your expertise and what you're looking for..."
                    rows={4}
                    maxLength={260}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-12 pt-8 border-t border-[#111827]/10/10 flex flex-col sm:flex-row gap-4 items-center justify-end">
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSaving ? "Saving..." : "Save Profile"}
                <span className="material-symbols-outlined text-lg">save</span>
              </button>
            </div>
          </div>

          {/* Helpful Tip Card (Editorial Pattern) */}
          <div className="mt-8 bg-[#143D30] text-white  rounded-2xl p-6 md:p-8 border border border-[#111827]/10 flex flex-col sm:flex-row gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#143D30] text-white  rounded-full blur-2xl group-hover:bg-[#143D30] text-white  transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-white border border-[#111827]/10 shadow-sm flex items-center justify-center shrink-0 shadow-lg relative z-10">
              <span className="material-symbols-outlined text-[#143D30]">lightbulb</span>
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-medium text-white mb-2">Editorial Tip</h4>
              <p className="text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
                Profiles with professional headshots and a specific title receive <strong className="text-[#52c2ad] font-bold">3x more marketplace inquiries</strong>. Keep your bio punchy and focus on your unique value proposition.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
