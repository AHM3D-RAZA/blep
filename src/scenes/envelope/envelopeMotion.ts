import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Stages of the envelope tap-to-open sequence.
 *
 * closed   -> resting in the meadow, idle float only
 * breaking -> wax seal cracks apart
 * opening  -> flap folds open, letter begins sliding up from the pocket
 * opened   -> letter is peeking out and tappable to move on to LetterOneScene
 */
export type EnvelopeStage = 'closed' | 'breaking' | 'opening' | 'opened';

/**
 * Timing for each phase of the open sequence. Kept in one place so the
 * animation durations in `Envelope.css` and the state machine below never
 * drift out of sync — if a duration changes, update it here only.
 */
export const ENVELOPE_TIMING = {
  sealBreakMs: 520,
  flapOpenMs: 780,
} as const;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Drives the closed -> breaking -> opening -> opened state machine.
 * `Envelope.tsx` only needs to know the current stage and call `open()` —
 * all sequencing/timing/reduced-motion logic lives here.
 */
export function useEnvelopeSequence() {
  const [stage, setStage] = useState<EnvelopeStage>('closed');
  const pendingTimers = useRef<number[]>([]);

  useEffect(() => {
    const timers = pendingTimers.current;
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const open = useCallback(() => {
    setStage((current) => (current === 'closed' ? 'breaking' : current));
  }, []);

  useEffect(() => {
    if (stage !== 'breaking') return undefined;
    const duration = prefersReducedMotion() ? 60 : ENVELOPE_TIMING.sealBreakMs;
    const id = window.setTimeout(() => setStage('opening'), duration);
    pendingTimers.current.push(id);
    return () => window.clearTimeout(id);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'opening') return undefined;
    const duration = prefersReducedMotion() ? 60 : ENVELOPE_TIMING.flapOpenMs;
    const id = window.setTimeout(() => setStage('opened'), duration);
    pendingTimers.current.push(id);
    return () => window.clearTimeout(id);
  }, [stage]);

  return { stage, open };
}
