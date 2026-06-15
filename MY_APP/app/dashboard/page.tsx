"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const userRole = useQuery(api.users.getUserRole);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
    }
  }, [isLoaded, userId, router]);

  useEffect(() => {
    if (userRole === "freelancer") {
      router.push("/freelancer/dashboard");
    } else if (userRole === "client") {
      router.push("/client/dashboard");
    }
  }, [userRole, router]);

  // Show a loading state while we check their role
  if (!isLoaded || userRole === undefined) {
    return (
      <div className="bg-transparent flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-8 h-8 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
      </div>
    );
  }

  // If userRole is null, allow the user to select their path
  if (userRole !== null) return null;

  return (
    <div className="bg-transparent text-[#111827] font-body selection:bg-[#143D30] text-white   flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 w-full">
      <h1 className="text-3xl font-serif tracking-tight mb-8 text-[#111827]">How do you want to use SKILLIFY?</h1>
      <div className="flex flex-col sm:flex-row gap-8">
        <Link 
          href="/onboarding/profile" 
          className="flex flex-col items-center justify-center p-10 bg-white border border-[#111827]/10 shadow-sm rounded-2xl hover:border-[#111827]/10 hover:bg-white border border-[#111827]/10 shadow-sm transition-all group w-72 shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#143D30] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl text-white">
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
    </div>
  );
}
