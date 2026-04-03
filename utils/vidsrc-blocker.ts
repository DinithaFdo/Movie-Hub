/**
 * VidSrc Ad Blocker - Blocks ads and popups in embedded VidSrc player
 * Uses script injection and DOM manipulation to remove ad elements
 */

export function setupVidSrcAdBlocker(): void {
  if (typeof window === "undefined") return;

  // Aggressive ad blocking for VidSrc
  const blockAds = () => {
    try {
      // Remove common ad containers
      const adSelectors = [
        '[id*="ad"]',
        '[class*="ad"]',
        '[id*="banner"]',
        '[class*="banner"]',
        '[id*="popup"]',
        '[class*="popup"]',
        '[id*="modal"]',
        '[class*="modal"]',
        '[id*="overlay"]',
        '[class*="overlay"]',
        'iframe[src*="ads"]',
        'iframe[src*="advert"]',
        'script[src*="ads"]',
        'script[src*="analytics"]',
        ".adsbygoogle",
        "[data-ad-container]",
      ];

      adSelectors.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            // Check if it's not our content
            if (!el.closest("[data-content-video]")) {
              el.remove();
            }
          });
        } catch (e) {
          // Ignore invalid selectors
        }
      });

      // Remove tracking and analytics scripts
      const scripts = document.querySelectorAll("script");
      scripts.forEach((script) => {
        const src = script.getAttribute("src") || "";
        const hasTracker =
          src.includes("analytics") ||
          src.includes("google") ||
          src.includes("facebook") ||
          src.includes("ads");

        if (hasTracker) {
          script.remove();
        }
      });

      // Block window.open popups
      const originalOpen = window.open;
      window.open = function (...args: any[]) {
        const url = args[0] as string;

        // Only allow opens from our domain or known safe sources
        if (!url || url.includes("vidsrc") === false) {
          console.warn("Blocked popup attempt:", url);
          return null as any;
        }

        return originalOpen(args[0], args[1], args[2]);
      };

      // Monitor for new ad injections
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;

              if (
                element.id?.includes("ad") ||
                element.className?.includes("ad") ||
                element.id?.includes("popup") ||
                element.className?.includes("popup")
              ) {
                element.remove();
              }
            }
          });
        });
      });

      // Start observing the document body
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
      });

      // Stop observer after 30 seconds (to prevent memory leaks)
      setTimeout(() => observer.disconnect(), 30000);
    } catch (error) {
      console.error("Error in ad blocker:", error);
    }
  };

  // Run immediately and periodically
  blockAds();
  const interval = setInterval(blockAds, 2000);

  // Clean up interval on page unload
  window.addEventListener("beforeunload", () => {
    clearInterval(interval);
  });
}

/**
 * Setup content security policy for ads
 */
export function setupContentSecurityPolicy(): void {
  if (typeof window === "undefined") return;

  const meta = document.createElement("meta");
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vidsrc.xyz https://cdn.jsdelivr.net;
    img-src 'self' data: https:;
    style-src 'self' 'unsafe-inline';
    frame-src https://vidsrc.xyz;
    connect-src 'self' https: wss:;
  `;

  if (document.head) {
    document.head.appendChild(meta);
  }
}

/**
 * Block known ad networks
 */
export function blockAdNetworks(): void {
  if (typeof window === "undefined") return;

  const blockedDomains = [
    "ads.google.com",
    "pagead2.googlesyndication.com",
    "adservice.google.com",
    "facebook.com",
    "connect.facebook.net",
    "platform.twitter.com",
  ];

  // Try to block via DNS-like approach (if available)
  const originalFetch = window.fetch;
  (window as any).fetch = function (...args: any[]) {
    const url = typeof args[0] === "string" ? args[0] : "";

    for (const blockedDomain of blockedDomains) {
      if (url.includes(blockedDomain)) {
        console.warn("Blocked ad network request:", url);
        return Promise.reject(new Error("Blocked ad network"));
      }
    }

    return originalFetch(args[0], args[1]);
  };
}

/**
 * Initialize all ad blocking features
 */
export function initializeAdBlocker(): void {
  if (typeof window === "undefined") return;

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupVidSrcAdBlocker();
      blockAdNetworks();
    });
  } else {
    setupVidSrcAdBlocker();
    blockAdNetworks();
  }
}
