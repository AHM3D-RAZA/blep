import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DaisyGraphic } from '../meadow/DaisyGraphic';
import { GroundedFlowerBase } from './GroundedFlowerBase';
import { daisyGame } from '../../content/daisyGame';
import { DAISY_GAME_POSITION } from './daisyGameTarget';
import './DaisyGame.css';

interface DaisyGameTriggerProps {
  /**
   * Portal target — same atmosphere layer MemoryBubbles/OurTime use, for
   * two reasons: it sits above every scene's own overlay (letters, audio,
   * night sky, the dedicated "explore" scene), which otherwise blocks
   * clicks to anything underneath even where they're visually
   * transparent; and it isn't subject to the meadow's own slow camera
   * drift, so a `position: fixed` overlay opened from here won't drift
   * along with the background. See daisyGameTarget.ts for why this isn't
   * one of the meadow's own generated daisies.
   */
  atmosphereLayer: HTMLElement | null;
  /**
   * False for the whole loading screen — the daisy is still visible
   * (it's a real part of the field, after all), just plain and
   * untappable, identical to an ordinary daisy, so there's nothing
   * distracting or temptingly tappable during that opening moment.
   * True permanently from the first time the meadow scene is actually
   * reached onward, at which point its color tint and glow fade in
   * (see easterEggsRevealed in MeadowScene.tsx).
   */
  revealed: boolean;
}

const MIN_PETALS = 5;
const MAX_PETALS = 8;

/**
 * Shuffle-bag picker: hands out every petal message once, in a freshly
 * shuffled order, before reshuffling — so the messages come in random
 * order (not the same fixed escalating sequence every time) without
 * repeating one twice in a row. Same technique as the memory bubbles'
 * and compliment daisy's pickers.
 */
function createPetalMessagePicker(entries: string[]) {
  let bag: string[] = [];
  const refill = () => {
    bag = [...entries];
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      ;[bag[i], bag[j]] = [bag[j], bag[i]];
    }
  };
  return function next(): string | null {
    if (entries.length === 0) return null;
    if (bag.length === 0) refill();
    return bag.pop() ?? null;
  };
}

/**
 * The rigged "He Loves Me... He Loves Me More" Easter egg: a small
 * daisy, tappable anywhere in the journey, opening a petal-plucking
 * mini-game. The petal count is randomized (5-8) each time it's
 * opened, and each petal plucked (except the last) shows one more
 * declaration drawn in random order from `daisyGame.petalMessages`
 * (a shuffle-bag, so nothing repeats twice in a row). Whichever
 * petal is tapped last — regardless of the random count — the result
 * shown afterward is always picked from `daisyGame.results`, which is
 * entirely made of positive/romantic/funny lines. There's no
 * alternating "loves me / loves me not" logic anywhere in here to
 * accidentally get wrong — the classic phrasing is just the framing
 * text, not something the game actually computes, and a random petal
 * count can never change that: it's the *content* that's rigged
 * (always positive), not the parity.
 */
export function DaisyGameTrigger({ atmosphereLayer, revealed }: DaisyGameTriggerProps) {
  const [open, setOpen] = useState(false);

  if (!atmosphereLayer) return null;

  return createPortal(
    <>
      <button
        type="button"
        className={`daisy-game-trigger${revealed ? ' is-revealed' : ''}`}
        aria-label="a daisy"
        onClick={revealed ? () => setOpen(true) : undefined}
        aria-hidden={!revealed}
        tabIndex={revealed ? 0 : -1}
        style={DAISY_GAME_POSITION}
      >
        <GroundedFlowerBase />
        <DaisyGraphic />
      </button>
      {open && <DaisyGameOverlay onClose={() => setOpen(false)} />}
    </>,
    atmosphereLayer,
  );
}

function DaisyGameOverlay({ onClose }: { onClose: () => void }) {
  // Randomized once per time the game is opened (this component mounts
  // fresh each time), not on every render.
  const [petalCount] = useState(() => MIN_PETALS + Math.floor(Math.random() * (MAX_PETALS - MIN_PETALS + 1)));
  const petalAngles = useMemo(() => Array.from({ length: petalCount }, (_, i) => (360 / petalCount) * i), [petalCount]);

  const [pluckedIndices, setPluckedIndices] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState<{ text: string; key: number } | null>(null);
  const [result] = useState(() => daisyGame.results[Math.floor(Math.random() * daisyGame.results.length)]);
  const petalMessagePickerRef = useRef(createPetalMessagePicker(daisyGame.petalMessages));

  const allPlucked = pluckedIndices.size >= petalCount;
  const remaining = petalCount - pluckedIndices.size;

  const handlePluck = (index: number) => {
    if (pluckedIndices.has(index)) return;
    const pluckedSoFar = pluckedIndices.size + 1;
    setPluckedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    // The last petal's line comes from the big final `result` reveal
    // below instead — only the ones before it draw from the shuffled
    // petalMessages.
    if (pluckedSoFar < petalCount) {
      const text = petalMessagePickerRef.current();
      if (text) setMessage({ text, key: pluckedSoFar });
    }
  };

  return (
    <div className="daisy-game-overlay" role="dialog" aria-label={daisyGame.prompt} onClick={onClose}>
      <div className="daisy-game-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="daisy-game-card__close" aria-label="close" onClick={onClose}>
          ×
        </button>

        {!allPlucked ? (
          <>
            <p className="daisy-game-card__prompt">{daisyGame.prompt}</p>

            <svg viewBox="-64 -64 128 128" className="daisy-game__svg" aria-hidden="true">
              <circle r="12" fill="#e6b23f" />
              <circle r="12" fill="none" stroke="#c98f5e" strokeWidth="0.6" opacity="0.4" />
              {petalAngles.map((angle, i) => {
                const plucked = pluckedIndices.has(i);
                return (
                  <g key={i} transform={`rotate(${angle})`}>
                    {/* Invisible, larger hit-target — the visible petal
                        below is drawn slim/elegant, but SVG shapes with
                        a transparent fill aren't hit-testable by default
                        (pointer-events: visiblePainted is the initial
                        value), so a bigger transparent shape underneath
                        keeps tapping comfortable on Android without
                        making the artwork itself chunky. */}
                    <ellipse
                      cx="0"
                      cy="-26"
                      rx="15"
                      ry="27"
                      fill="transparent"
                      style={{ pointerEvents: plucked ? 'none' : 'all', cursor: plucked ? 'default' : 'pointer' }}
                      onClick={() => handlePluck(i)}
                    />
                    <ellipse
                      className={`daisy-game__petal${plucked ? ' is-plucked' : ''}`}
                      cx="0"
                      cy="-26"
                      rx="8"
                      ry="20"
                      pointerEvents="none"
                    />
                  </g>
                );
              })}
            </svg>

            <p key={message?.key ?? 0} className="daisy-game-card__message">
              {message ? message.text : `${remaining} ${remaining === 1 ? 'petal' : 'petals'} left`}
            </p>
          </>
        ) : (
          <div className="daisy-game-card__result">
            <p className="daisy-game-card__result-text">{result}</p>
            <Sparkles />
          </div>
        )}
      </div>
    </div>
  );
}

function Sparkles() {
  const points = [0, 60, 120, 180, 240, 300];
  return (
    <span className="daisy-game-card__sparkles" aria-hidden="true">
      {points.map((angle) => (
        <span key={angle} className="daisy-game-card__spark" style={{ '--spark-angle': `${angle}deg` } as React.CSSProperties}>
          ✦
        </span>
      ))}
    </span>
  );
}
