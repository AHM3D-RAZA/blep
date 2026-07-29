import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Everything the custom CD player needs, with no default browser audio
 * UI involved anywhere. This hook owns a single hidden <audio> element
 * and exposes plain state + actions for `CDPlayer` to render however it
 * likes (per the project bible's "no default browser audio UI" rule).
 */
export interface AudioPlayerState {
  /** True while audio is actively playing (not paused, not ended). */
  isPlaying: boolean;
  /** True once playback has reached the end. */
  hasEnded: boolean;
  /** Current playback position, 0-1. */
  progress: number;
  /** Current time in seconds, for display. */
  currentTime: number;
  /** Full duration in seconds, once known (0 until metadata loads). */
  duration: number;
  /** True while the browser is buffering/loading the file. */
  isLoading: boolean;
  /** True if the audio file failed to load (missing asset, etc.). */
  hasError: boolean;
  /** True during a brief playful "scratch" wobble on the record. */
  isScratching: boolean;
}

export interface AudioPlayerControls extends AudioPlayerState {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  replay: () => void;
  /** Seek to a 0-1 position, used by the ribbon progress control. */
  seekTo: (fraction: number) => void;
  /** Momentary playful scratch — nudges playback rate then settles back. */
  scratch: () => void;
}

const SCRATCH_DURATION_MS = 260;

export function useAudioPlayer(): AudioPlayerControls {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scratchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && Number.isFinite(audio.duration)) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setIsLoading(false);
    };
    const handlePlay = () => {
      setIsPlaying(true);
      setHasEnded(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
      setProgress(1);
    };
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
      if (scratchTimeoutRef.current) clearTimeout(scratchTimeoutRef.current);
    };
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // Never permanently lock playback out — if a previous attempt failed
    // (e.g. the file wasn't in place yet), retry by reloading the source
    // before playing again, so fixing the file just works on next tap.
    if (hasError) {
      setHasError(false);
      audio.load();
    }
    // Autoplay policies require this to run from a user gesture, which is
    // always the case here (a tap on the play button).
    void audio.play().catch(() => setHasError(true));
  }, [hasError]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const replay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setProgress(0);
    setHasEnded(false);
    void audio.play().catch(() => setHasError(true));
  }, []);

  const seekTo = useCallback((fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const clamped = Math.min(1, Math.max(0, fraction));
    audio.currentTime = clamped * duration;
    setProgress(clamped);
    setHasEnded(false);
  }, [duration]);

  const scratch = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;
    if (scratchTimeoutRef.current) clearTimeout(scratchTimeoutRef.current);
    setIsScratching(true);
    const originalRate = audio.playbackRate;
    audio.playbackRate = 0.35;
    scratchTimeoutRef.current = setTimeout(() => {
      audio.playbackRate = originalRate;
      setIsScratching(false);
    }, SCRATCH_DURATION_MS);
  }, [isPlaying]);

  return {
    audioRef,
    isPlaying,
    hasEnded,
    progress,
    currentTime,
    duration,
    isLoading,
    hasError,
    isScratching,
    play,
    pause,
    toggle,
    replay,
    seekTo,
    scratch,
  };
}

/** Formats seconds as `m:ss`, used by the progress display. */
export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
