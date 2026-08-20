import { useEffect, useRef, useState } from 'react';
import { shootingStarMessages } from '../../content/site';
import './ShootingStar.css';

interface ShootingStarProps {
  /** The parent only mounts this component once the moment should begin. */
  active: boolean;
  /** Called once the whole moment is over — crossed and faded, whether or not it was caught. */
  onDone: () => void;
}

const CROSS_DURATION_MS = 2600;
const MESSAGE_HOLD_MS = 4200;
const MISSED_GRACE_MS = 900;

/**
 * A single quiet shooting star. If it's tapped while crossing, it leaves
 * behind one short glowing line of text that fades on its own — no
 * popup, no modal. If it's ignored, nothing happens; the moment just
 * passes, same as the project bible asks for.
 */
export function ShootingStar({ active, onDone }: ShootingStarProps) {
  // The parent (`NightSkyScene`) only renders this component once `active`
  // is already true, so there's no separate "idle" phase to wait through —
  // it starts crossing immediately on mount.
  const [phase, setPhase] = useState<'crossing' | 'caught' | 'gone'>('crossing');
  const [message] = useState(() => shootingStarMessages[Math.floor(Math.random() * shootingStarMessages.length)]);

  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (phase !== 'crossing') return;
    const id = window.setTimeout(() => {
      setPhase('gone');
      window.setTimeout(() => doneRef.current(), MISSED_GRACE_MS);
    }, CROSS_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'caught') return;
    const id = window.setTimeout(() => {
      setPhase('gone');
      doneRef.current();
    }, MESSAGE_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  if (!active || phase === 'gone') return null;

  return (
    <div className="shooting-star-layer" aria-hidden={phase !== 'caught'}>
      {phase === 'crossing' && (
        <button
          type="button"
          className="shooting-star"
          onClick={() => setPhase('caught')}
          aria-label="a shooting star"
        >
          <span className="shooting-star__trail" />
        </button>
      )}

      {phase === 'caught' && (
        <p className="shooting-star__message" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
