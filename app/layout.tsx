import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import LandingPage from "@/components/core/LandingPage";
import Navigation from "@/components/layout/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { RandomSportNotifier } from "@/hooks/useSportNotifier";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MFitness - Ryan Liceanse Project",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster />
          <SignedOut>
            <LandingPage />
          </SignedOut>

          <SignedIn>
            <RandomSportNotifier>
              <div className=" w-full">
                <Navigation />
              </div>
              {children}
            </RandomSportNotifier>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
