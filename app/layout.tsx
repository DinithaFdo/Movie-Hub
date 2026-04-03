import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";

import { EnhancedAppNavbar } from "@/components/layout/enhanced-navbar";
import { EnhancedThemeProvider } from "@/components/theme/enhanced-theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/toast-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { FavoritesProvider } from "@/context/favorites-context";
import { ScrollRevealScript } from "@/components/scroll-reveal-script";

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
  title: "MovieHub · Enterprise Streaming Platform",
  description:
    "Modern movie & TV streaming platform with advanced search, recommendations, and collection management. Built with Next.js, React, and TMDB.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "MovieHub · Enterprise Streaming Platform",
    description: "The next-generation movie and TV streaming platform",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffa31a" />
      </head>
      <body
        className={`${sansFont.variable} ${headingFont.variable} antialiased`}
        suppressHydrationWarning
      >
        <EnhancedThemeProvider>
          <QueryProvider>
            <FavoritesProvider>
              <ErrorBoundary>
                <div className="min-h-screen overflow-x-clip bg-(--bg-base) text-(--text-primary)">
                  <EnhancedAppNavbar />
                  <main className="relative">{children}</main>
                  <ToastProvider />
                  <ScrollRevealScript />
                </div>
              </ErrorBoundary>
            </FavoritesProvider>
          </QueryProvider>
        </EnhancedThemeProvider>
      </body>
    </html>
  );
}
