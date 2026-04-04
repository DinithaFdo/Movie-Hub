export type UiSoundVariant = "nav" | "toggle" | "page";

function getFrequency(variant: UiSoundVariant): [number, number] {
  switch (variant) {
    case "toggle":
      return [220, 440];
    case "page":
      return [360, 520];
    case "nav":
    default:
      return [280, 420];
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

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(baseFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    baseFrequency * 1.18,
    now + 0.045,
  );

  secondaryOscillator.type = "sine";
  secondaryOscillator.frequency.setValueAtTime(accentFrequency, now);
  secondaryOscillator.frequency.exponentialRampToValueAtTime(
    accentFrequency * 1.06,
    now + 0.05,
  );

  filter.type = "highpass";
  filter.frequency.value = 180;
  filter.Q.value = 0.8;

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

  oscillator.connect(filter);
  secondaryOscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(now);
  secondaryOscillator.start(now);
  oscillator.stop(now + 0.15);
  secondaryOscillator.stop(now + 0.15);

  oscillator.onended = () => {
    context.close().catch(() => undefined);
  };
}
