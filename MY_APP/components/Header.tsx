"use client";

import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  // Hide the entire header or just auth buttons on specific routes
  const isProfileRoute = pathname?.startsWith("/client") || pathname?.startsWith("/freelancer") || pathname?.startsWith("/onboarding") || pathname?.startsWith("/guide") || pathname?.startsWith("/chat") || pathname?.startsWith("/payment");

  if (isProfileRoute || pathname === "/" || pathname === "/about") {
    return null;
  }

  return (
    <header className="absolute top-0 z-50 w-full bg-transparent pt-6">
      <div className="container mx-auto flex h-20 items-center justify-between px-8 xl:max-w-7xl">
        
        {/* Logo Left */}
        <Link href="/" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#111827] text-4xl font-serif tracking-tight transform -rotate-12">
            rebase_edit
          </span>
          <div className="flex flex-col leading-none ml-2">
            <span className="text-lg md:text-xl font-medium tracking-[0.2em] text-[#111827] uppercase">
              SKILLIFY
            </span>
            <span className="text-[0.6rem] font-medium tracking-[0.3em] text-[#111827] uppercase mt-1">
              FREELANCE
            </span>
          </div>
        </Link>
        
        {/* Nav Links Center */}
        <nav className="hidden lg:flex items-center space-x-7">
          <Show when="signed-out">
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="text-sm font-medium text-[#111827] hover:text-[#52c2ad] transition-colors cursor-pointer">
                Log In
              </button>
            </SignInButton>
          </Show>
        </nav>

        {/* CTA Right */}
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="bg-[#52c2ad] text-[#111827] px-6 py-2.5 rounded-full font-medium text-[0.85rem] border border-[#111827]/10 shadow-sm hover:-translate-y-0.5 hover:shadow-[1px_1px_0px_#111827] transition-all flex items-center justify-center gap-3 group cursor-pointer hidden md:flex">
                Hire a Freelancer 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>
            
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="bg-[#52c2ad] text-[#111827] w-10 h-10 rounded-full border border-[#111827]/10 shadow-sm flex items-center justify-center cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111827] transition-all">
                <span className="font-serif font-semibold text-xl italic mt-0.5">?</span>
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center justify-center p-0.5 rounded-full bg-white border border-[#111827]/10 shadow-sm">
              <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
            </div>
          </Show>
        </div>

      </div>
    </header>
  );
}
