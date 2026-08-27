import { useEffect, useRef, useState } from 'react';
import { shootingStarMessages } from '../../content/site';
import './ShootingStar.css';

interface ShootingStarProps {
  /** The parent only mounts this component once the moment should begin. */
  active: boolean;
  /** Called once the whole moment is over — crossed, faded, whether or not it was caught. */
  onDone: () => void;
}

const ANTICIPATION_MS = 850; // a star quietly brightens before it launches
const CROSS_DURATION_MS = 3000; // matches the comet-fly keyframes' own duration below
const MESSAGE_HOLD_MS = 4200;
const FADE_MS = 1000; // lingering particles after the comet itself is gone

type Phase = 'anticipation' | 'crossing' | 'caught' | 'fading' | 'gone';

/**
 * The night-sky wish's comet: a quiet star brightens, then streaks
 * across the sky, then a few last embers linger and fade. If it's
 * tapped while crossing, it leaves behind one short glowing line of
 * text that fades on its own — no popup, no modal. If it's ignored,
 * nothing happens; the moment just passes.
 */
export function ShootingStar({ active, onDone }: ShootingStarProps) {
  // The parent (`NightSkyScene`) only renders this component once `active`
  // is already true, so there's no separate "idle" phase to wait through —
  // it starts its anticipation beat immediately on mount.
  const [phase, setPhase] = useState<Phase>('anticipation');
  const [message] = useState(() => shootingStarMessages[Math.floor(Math.random() * shootingStarMessages.length)]);

  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (phase !== 'anticipation') return;
    const id = window.setTimeout(() => setPhase('crossing'), ANTICIPATION_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'crossing') return;
    const id = window.setTimeout(() => setPhase('fading'), CROSS_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'caught') return;
    const id = window.setTimeout(() => setPhase('fading'), MESSAGE_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'fading') return;
    const id = window.setTimeout(() => {
      setPhase('gone');
      doneRef.current();
    }, FADE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  if (!active || phase === 'gone') return null;

  return (
    <div className="shooting-star-layer" aria-hidden={phase !== 'caught'}>
      {phase === 'anticipation' && <span className="shooting-star__flare" aria-hidden="true" />}

      {phase === 'crossing' && (
        <button type="button" className="shooting-star" onClick={() => setPhase('caught')} aria-label="a shooting star">
          <Comet />
        </button>
      )}

      {phase === 'caught' && (
        <p className="shooting-star__message" role="status">
          {message}
        </p>
      )}

      {phase === 'fading' && (
        <span className="shooting-star__afterglow" aria-hidden="true">
          <span className="shooting-star__ember" />
          <span className="shooting-star__ember" />
          <span className="shooting-star__ember" />
          <span className="shooting-star__ember" />
        </span>
      )}
    </div>
  );
}

/**
 * The comet itself: a bright glowing core with a soft outer bloom, two
 * overlapping tapered tail layers (a wide soft one, a narrower brighter
 * one) for depth, and a few small trailing embers — drawn as one small
 * SVG so the shape tapers to a natural point instead of a hard-edged
 * CSS gradient bar. Head sits at the right of the viewBox; the whole
 * element is rotated by the flight-path animation in the CSS below.
 */
function Comet() {
  return (
    <svg viewBox="-150 -40 300 80" className="comet-svg" aria-hidden="true">
      <defs>
        <radialGradient id="comet-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffdf6" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffe4ac" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffe4ac" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="comet-tail-wide" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#fff6e2" stopOpacity="0.55" />
          <stop offset="25%" stopColor="#ffdda3" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffdda3" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="comet-tail-bright" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#fffdf6" stopOpacity="0.9" />
          <stop offset="18%" stopColor="#fff1cf" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fff1cf" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* soft outer bloom behind the head */}
      <circle cx="118" cy="0" r="30" fill="url(#comet-core-glow)" />

      {/* wide, soft outer tail layer */}
      <path d="M -150 0 Q -40 -16 68 -7 Q 104 -3 122 0 Q 104 3 68 7 Q -40 16 -150 0 Z" fill="url(#comet-tail-wide)" />

      {/* narrower, brighter inner tail layer, for depth */}
      <path d="M -95 0 Q -18 -6 78 -2.4 Q 100 -1 112 0 Q 100 1 78 2.4 Q -18 6 -95 0 Z" fill="url(#comet-tail-bright)" />

      {/* a few small embers trailing behind the head */}
      <circle className="comet-ember comet-ember--a" cx="30" cy="4" r="1.6" fill="#fff3d6" />
      <circle className="comet-ember comet-ember--b" cx="-15" cy="-3" r="1.2" fill="#ffe9bd" />
      <circle className="comet-ember comet-ember--c" cx="-55" cy="2.5" r="1" fill="#ffdfa0" />

      {/* bright core */}
      <circle cx="120" cy="0" r="8" fill="url(#comet-core-glow)" />
      <circle cx="120" cy="0" r="4.4" fill="#fffdf6" />
    </svg>
  );
}
