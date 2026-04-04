export type UiSoundVariant = "nav" | "toggle" | "page";

function getFrequency(variant: UiSoundVariant): [number, number] {
  switch (variant) {
    case "toggle":
      return [2500, 1200];
    case "page":
      return [2200, 900];
    case "nav":
    default:
      return [2000, 750];
  }
}

export async function playModernUiSound(variant: UiSoundVariant = "nav") {
  if (typeof window === "undefined") return;

  const AudioContextClass =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  if (context.state === "suspended") {
    await context.resume();
  }

  const oscillator = context.createOscillator();
  const secondaryOscillator = context.createOscillator();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();

  const [baseFrequency, accentFrequency] = getFrequency(variant);
  const now = context.currentTime;

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(baseFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    baseFrequency * 0.72,
    now + 0.02,
  );

  secondaryOscillator.type = "triangle";
  secondaryOscillator.frequency.setValueAtTime(accentFrequency, now);
  secondaryOscillator.frequency.exponentialRampToValueAtTime(
    accentFrequency * 0.68,
    now + 0.02,
  );

  filter.type = "highpass";
  filter.frequency.value = 1100;
  filter.Q.value = 0.6;

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.03, now + 0.003);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  oscillator.connect(filter);
  secondaryOscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(now);
  secondaryOscillator.start(now);
  oscillator.stop(now + 0.035);
  secondaryOscillator.stop(now + 0.035);

  oscillator.onended = () => {
    context.close().catch(() => undefined);
  };
}
