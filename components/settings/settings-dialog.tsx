"use client";

import { Bell, Play, Shield, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { usePreferencesStore } from "@/stores/preferences";

export function SettingsDialog({ children }: { children: React.ReactNode }) {
  const { preferences, updatePreference } = usePreferencesStore();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-6 md:p-8 bg-[#1A1A1D] border border-white/5 shadow-2xl rounded-3xl md:rounded-[2.5rem] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          <div className="flex items-center justify-between mb-8">
            <Dialog.Title className="text-2xl font-black tracking-tight text-white m-0">
              Settings
            </Dialog.Title>
            <Dialog.Close className="p-2 bg-white/5 rounded-full text-[#8A8A8E] hover:text-white hover:bg-white/10 transition-colors">
              <X size={20} />
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8A8E]">Playback</h3>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/40 rounded-xl text-[#D4FF3E]">
                    <Play size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Cinematic Autoplay</h4>
                    <p className="text-[#8A8A8E] text-xs font-medium max-w-[200px]">Play trailers in the background on the Home screen</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference("enableAutoplay", !preferences.enableAutoplay)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.enableAutoplay ? "bg-[#D4FF3E]" : "bg-white/20"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${preferences.enableAutoplay ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8A8E]">Privacy & Sync</h3>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/40 rounded-xl text-[#D4FF3E]">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Enable Analytics</h4>
                    <p className="text-[#8A8A8E] text-xs font-medium max-w-[200px]">Help us improve with anonymous data</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference("enableAnalytics", !preferences.enableAnalytics)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.enableAnalytics ? "bg-[#D4FF3E]" : "bg-white/20"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${preferences.enableAnalytics ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/40 rounded-xl text-[#D4FF3E]">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Notifications</h4>
                    <p className="text-[#8A8A8E] text-xs font-medium max-w-[200px]">Alerts for new episodes</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference("enableNotifications", !preferences.enableNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.enableNotifications ? "bg-[#D4FF3E]" : "bg-white/20"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${preferences.enableNotifications ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

            </div>
          </div>
          
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
