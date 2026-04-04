"use client";

import { Play, Sparkles, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { usePreferencesStore } from "@/stores/preferences";
import { playModernUiSound } from "@/utils/sound-effects";

interface SettingsDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({
  children,
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const { preferences, updatePreference } = usePreferencesStore();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-6 md:p-8 bg-[#1A1A1D] border border-white/5 shadow-2xl rounded-3xl md:rounded-[2.5rem] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex items-center justify-between mb-8">
            <Dialog.Title className="text-2xl font-black tracking-tight text-white m-0">
              Settings
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Manage playback and interaction preferences.
            </Dialog.Description>
            <Dialog.Close className="p-2 bg-white/5 rounded-full text-[#8A8A8E] hover:text-white hover:bg-white/10 transition-colors">
              <X size={20} />
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8A8E]">
                Playback
              </h3>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/40 rounded-xl text-[#D4FF3E]">
                    <Play size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      Cinematic Autoplay
                    </h4>
                    <p className="text-[#8A8A8E] text-xs font-medium max-w-[200px]">
                      Play trailers in the background on the Home screen
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    updatePreference(
                      "enableAutoplay",
                      !preferences.enableAutoplay,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.enableAutoplay ? "bg-[#D4FF3E]" : "bg-white/20"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${preferences.enableAutoplay ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A8A8E]">
                Interaction
              </h3>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/40 rounded-xl text-[#D4FF3E]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      Click Sounds
                    </h4>
                    <p className="text-[#8A8A8E] text-xs font-medium max-w-[200px]">
                      Add subtle futuristic sounds to buttons and navigation
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    updatePreference(
                      "enableClickSounds",
                      !preferences.enableClickSounds,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.enableClickSounds ? "bg-[#D4FF3E]" : "bg-white/20"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${preferences.enableClickSounds ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm">
                    Test click sound
                  </h4>
                  <p className="text-[#8A8A8E] text-xs font-medium max-w-[240px]">
                    Quickly verify the sound effect without leaving settings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void playModernUiSound("toggle");
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-[#D4FF3E]/30 bg-[#D4FF3E]/10 px-4 py-2 text-sm font-bold text-[#D4FF3E] transition-all duration-300 hover:bg-[#D4FF3E] hover:text-black hover:scale-105"
                >
                  Play test sound
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
