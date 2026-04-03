/**
 * Global Scroll Reveal Observer - Initializes Intersection Observer for all reveal-on-scroll elements
 */

"use client";

import { useEffect } from "react";

export function ScrollRevealScript() {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      // Immediately reveal all elements if user prefers reduced motion
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
        el.classList.add("revealed");
      });
      return;
    }

    // Create observer for scroll reveal elements
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;

            // Add data-index based on position in DOM if not already set
            if (!element.hasAttribute("data-index")) {
              const siblings = Array.from(
                element.parentElement?.querySelectorAll(".reveal-on-scroll") ??
                  [],
              );
              const index = siblings.indexOf(element);
              if (index >= 0) {
                element.setAttribute("data-index", String(index % 4));
              }
            }

            element.classList.add("revealed");
            // Optionally unobserve after revealing
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    // Observe all reveal-on-scroll elements
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
