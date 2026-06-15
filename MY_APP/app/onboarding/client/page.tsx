"use client";

import { SignOutButton } from "@clerk/nextjs";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ClientProfilePage() {
  const router = useRouter();
  const generateUploadUrl = useMutation(api.clients.generateUploadUrl);
  const saveProfile = useMutation(api.clients.saveProfile);
  const profile = useQuery(api.clients.getProfile);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing profile data
  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName || "");
      setContactName(profile.contactName || "");
      setIndustry(profile.industry || "");
      setWebsite(profile.website || "");
      setDescription(profile.description || "");
      if (profile.logoUrl) {
        setImagePreview(profile.logoUrl);
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
      let logoId = profile?.logoId;

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
        logoId = storageId;
      }

      // 3. Save profile
      const args = {
        companyName,
        contactName,
        industry,
        website,
        description,
        logoId: logoId || undefined,
      };
      await saveProfile(args);
      router.push("/client/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving client profile.");
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
              <p className="text-[0.65rem] font-medium uppercase tracking-widest text-[#143D30] truncate">Client Setup</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <Link href="/onboarding/client" className="flex items-center gap-3 px-3 py-3 text-[#143D30] bg-[#143D30] text-white  border-r-2 border-indigo-500 transition-all rounded-l-xl group relative left-1">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
            <span className="uppercase tracking-[0.05em] text-[0.65rem] font-medium">Company Profile</span>
          </Link>

          <Link href="/client/dashboard" className="flex items-center gap-3 px-3 py-3 text-[#111827] hover:bg-white/5 hover:text-[#111827] rounded-xl transition-all group">
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Navigation */}
        <header className="sticky top-0 w-full z-30 px-6 md:px-12 py-6 flex justify-between items-center bg-transparent/80 backdrop-blur-2xl border-b border-[#111827]/10/10">
          <div>
            <span className="text-[0.65rem] font-medium uppercase tracking-widest text-[#111827] mb-1 block">Client Onboarding</span>
            <h2 className="text-2xl md:text-3xl font-serif tracking-tight tracking-tight text-[#111827]">Company Profile</h2>
          </div>
        </header>

        {/* Profile Form Section */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 py-12 relative z-10">
          <div className="bg-white border border-[#111827]/10 shadow-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-[#111827]/10 relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-transparent"></div>

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
                  <div className="w-48 h-48 rounded-xl bg-white border border-[#111827]/10 shadow-sm flex items-center justify-center border border-dashed border-white/20 overflow-hidden relative transition-all group-hover:border-purple-500/50">
                    {imagePreview ? (
                       // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover p-2" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl font-serif tracking-tight text-neutral-600 group-hover:text-[#111827] transition-colors">add_photo_alternate</span>
                    )}
                    {/* Hidden overlay for interactivity simulation */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <span className="text-[0.65rem] font-medium text-[#111827] uppercase tracking-widest flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-2xl">upload</span>
                        Upload Logo
                      </span>
                    </div>
                  </div>
                  <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#111827] border border-[#111827]/10 text-[#111827] shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:border-purple-500 transition-all pointer-events-none">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium text-[#111827]">Company Logo</p>
                  <p className="text-[0.65rem] text-[#111827] mt-1 uppercase tracking-widest">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </div>

              {/* Input Fields Area */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-600 block ml-1">Company Name</label>
                    <input
                      className="w-full bg-white border border-[#111827]/10 shadow-sm rounded-xl px-4 py-4 text-[#111827] placeholder:text-neutral-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none text-sm"
                      placeholder="e.g. Acme Corp"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  {/* Contact Name */}
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-600 block ml-1">Primary Contact</label>
                    <input
                      className="w-full bg-white border border-[#111827]/10 shadow-sm rounded-xl px-4 py-4 text-[#111827] placeholder:text-neutral-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none text-sm"
                      placeholder="e.g. Jane Doe"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Industry */}
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-600 block ml-1">Industry</label>
                    <input
                      className="w-full bg-white border border-[#111827]/10 shadow-sm rounded-xl px-4 py-4 text-[#111827] placeholder:text-neutral-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none text-sm"
                      placeholder="e.g. Fintech, Healthcare"
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>
                  
                  {/* Website */}
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-600 block ml-1">Website URL</label>
                    <input
                      className="w-full bg-white border border-[#111827]/10 shadow-sm rounded-xl px-4 py-4 text-[#111827] placeholder:text-neutral-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none text-sm"
                      placeholder="https://acme.com"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-600">Company Description</label>
                    <span className="text-[0.65rem] font-medium text-neutral-600 tracking-wider">{description.length} / 500</span>
                  </div>
                  <textarea
                    className="w-full bg-white border border-[#111827]/10 shadow-sm rounded-xl px-4 py-4 text-[#111827] placeholder:text-neutral-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none resize-none text-sm leading-relaxed"
                    placeholder="Briefly describe what your company does and who you're looking to hire..."
                    rows={5}
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                {isSaving ? "Saving..." : "Save Company"}
                <span className="material-symbols-outlined text-lg">save</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
