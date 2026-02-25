import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";

import { AppFooter } from "@/components/layout/app-footer";
import { AppNavbar } from "@/components/layout/app-navbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
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
          <FavoritesProvider>
            <div className="page-bg min-h-screen overflow-x-clip">
              <AppNavbar />
              {children}
              <AppFooter />
            </div>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
