/**
 * Hook for scroll reveal animations using Intersection Observer
 */

import { useEffect, useRef } from "react";

export function useScrollReveal(options?: {
  threshold?: number | number[];
  rootMargin?: string;
  delay?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      // Skip animation if user prefers reduced motion
      element.classList.add("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add slight delay before animating multiple elements
            if (options?.delay && element.hasAttribute("data-index")) {
              const index = element.getAttribute("data-index");
              element.setAttribute("data-delay", index || "0");
            }

            element.classList.add("revealed");
            // Optionally unobserve after animation
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? "0px 0px -50px 0px",
      },
    );

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options?.threshold, options?.rootMargin, options?.delay]);

  return ref;
}
