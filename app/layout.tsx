import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";

import { AppNavbar } from "@/components/layout/app-navbar";
import { EnhancedThemeProvider } from "@/components/theme/enhanced-theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/toast-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { FavoritesProvider } from "@/context/favorites-context";
import { ScrollRevealScript } from "@/components/scroll-reveal-script";
import { PreloaderProvider } from "@/components/context/preloader-context";
import { Preloader } from "@/components/layout/preloader";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Cinestream",
  description: "Discover the Series Streaming Experience",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`} suppressHydrationWarning>
        <EnhancedThemeProvider>
          <QueryProvider>
            <FavoritesProvider>
              <PreloaderProvider>
                <ErrorBoundary>
                  <div className="min-h-screen overflow-x-clip bg-[var(--bg-base)] text-[var(--text-primary)] font-body">
                    <Preloader />
                    <AppNavbar />
                    <main className="relative">{children}</main>
                    <ToastProvider />
                    <ScrollRevealScript />
                  </div>
                </ErrorBoundary>
              </PreloaderProvider>
            </FavoritesProvider>
          </QueryProvider>
        </EnhancedThemeProvider>
      </body>
    </html>
  );
}
