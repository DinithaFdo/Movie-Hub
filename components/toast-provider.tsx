/**
 * Toast Provider - Global notification system
 */

"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={3000}
      theme="dark"
      style={
        {
          "--sonner-color-error": "#ef4444",
          "--sonner-color-success": "#10b981",
          "--sonner-color-warning": "#f59e0b",
          "--sonner-color-info": "#3b82f6",
          "--sonner-color-text": "var(--text-primary)",
          "--sonner-color-background": "var(--bg-elevated)",
          "--sonner-border-radius": "var(--radius-lg)",
        } as React.CSSProperties
      }
    />
  );
}
