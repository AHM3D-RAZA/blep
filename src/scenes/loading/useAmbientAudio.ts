import { useEffect, useRef } from 'react';

interface UseAmbientAudioOptions {
  src: string;
  /** 0-1, the volume it fades in to. */
  targetVolume?: number;
  fadeInMs?: number;
  fadeOutMs?: number;
}

/**
 * Plays a looping ambient track, fading in on mount. Returns `stop()` so
 * the caller can fade it back out at a specific moment (e.g. right as the
 * opening scene's cinematic transition begins) instead of just cutting it
 * off on unmount.
 *
 * Autoplay-with-sound is commonly blocked by mobile browsers before any
 * user interaction has happened on the page — since this is the very
 * first thing shown, that will often be the case here. This fails
 * silently rather than surfacing an error: ambient sound is atmospheric
 * polish, not required content, and the spec calls for it to be "almost
 * silent" anyway.
 */
export function useAmbientAudio({ src, targetVolume = 0.2, fadeInMs = 1800, fadeOutMs = 1200 }: UseAmbientAudioOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const fadeTo = (target: number, durationMs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeIntervalRef.current !== null) window.clearInterval(fadeIntervalRef.current);

    const steps = 24;
    const stepMs = durationMs / steps;
    const startVolume = audio.volume;
    let i = 0;
    fadeIntervalRef.current = window.setInterval(() => {
      i += 1;
      const t = i / steps;
      audio.volume = Math.max(0, Math.min(1, startVolume + (target - startVolume) * t));
      if (i >= steps && fadeIntervalRef.current !== null) {
        window.clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    }, stepMs);
  };

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    audio
      .play()
      .then(() => fadeTo(targetVolume, fadeInMs))
      .catch(() => {
        // Autoplay blocked — fine, this is optional atmosphere.
      });

    return () => {
      if (fadeIntervalRef.current !== null) window.clearInterval(fadeIntervalRef.current);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const stop = () => {
    fadeTo(0, fadeOutMs);
    window.setTimeout(() => audioRef.current?.pause(), fadeOutMs + 50);
  };

  return { stop };
}
