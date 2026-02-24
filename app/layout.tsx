import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";

import { AppNavbar } from "@/components/layout/app-navbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppPreloader } from "@/components/ui/app-preloader";
import { FavoritesProvider } from "@/context/favorites-context";

import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const headingFont = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Hub · Next Generation Streaming",
  description:
    "Modern movie streaming platform built with Next.js, TMDB, and VidSrc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sansFont.variable} ${headingFont.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AppPreloader />
          <FavoritesProvider>
            <div className="page-bg min-h-screen">
              <AppNavbar />
              {children}
            </div>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
