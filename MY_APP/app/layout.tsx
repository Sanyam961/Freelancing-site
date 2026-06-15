import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import SyncUser from "@/components/SyncUser";
import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Clerk x Convex App",
  description: "A premium freelance marketplace powered by Clerk and Convex",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical Rive animations for instant rendering */}
        <link rel="preload" href="/hero-home.riv" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/angie.riv" as="fetch" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>{`:root { --font-playfair: 'Playfair Display', Georgia, serif; }`}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#FAF7F2] text-[#111827]`}
        suppressHydrationWarning
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <SyncUser />
            <div className="relative flex flex-col min-h-screen">
              {/* Premium Header */}
              <Header />

              {/* Main Content */}
              <main className="flex-1">
                {children}
              </main>

              {/* Footer */}
              <footer className="border-t border-[#111827]/10 py-6 text-center text-sm text-[#111827] bg-white font-medium">
                <p>© 2026 SKILLIFY. Built with Clerk, Convex, and Next.js.</p>
              </footer>
              
              <Chatbot />
            </div>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
