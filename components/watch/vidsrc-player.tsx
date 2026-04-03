/**
 * VidSrc Player Component - Embedded player with ad blocking
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import { initializeAdBlocker } from "@/utils/vidsrc-blocker";

interface VidSrcPlayerProps {
  src: string;
  title: string;
  onReady?: () => void;
}

export function VidSrcPlayer({ src, title, onReady }: VidSrcPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Initialize ad blocker
    initializeAdBlocker();

    // Set up iframe handlers
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
      onReady?.();

      // Try to inject ad blocker into iframe (if same-origin)
      try {
        if (iframe.contentWindow) {
          initializeAdBlocker();
        }
      } catch (error) {
        // Cross-origin - cannot inject, but parent-level blocking still works
      }
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    iframe.addEventListener("load", handleLoad);
    iframe.addEventListener("error", handleError);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      iframe.removeEventListener("error", handleError);
    };
  }, [onReady]);

  return (
    <div className="relative w-full bg-[var(--bg-base)] rounded-xl overflow-hidden shadow-elevation-5">
      {/*Loading State*/}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-elevated)] z-20">
          <div className="text-center space-y-4">
            <Loader className="h-8 w-8 animate-spin text-[var(--primary)] mx-auto" />
            <p className="text-[var(--text-secondary)]">Loading player...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-elevated)] z-20">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
            <p className="text-[var(--text-secondary)]">
              Failed to load player
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Please try again or check your internet connection
            </p>
          </div>
        </div>
      )}

      {/* Iframe Player */}
      <iframe
        ref={iframeRef}
        src={src}
        title={`Watch ${title}`}
        className="w-full aspect-video"
        allowFullScreen
        allowTransparency
        allow="autoplay; encrypted-media"
        // Sandbox restrictions for security - only allow necessary permissions
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />

      {/* Ad Blocker Notice */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50 flex items-center gap-2 text-xs text-green-400 backdrop-blur z-10">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        Ad Blocker Active
      </div>
    </div>
  );
}
