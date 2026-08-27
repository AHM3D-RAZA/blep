import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DaisyGraphic } from '../meadow/DaisyGraphic';
import { GroundedFlowerBase } from './GroundedFlowerBase';
import { compliments } from '../../content/compliments';
import { COMPLIMENT_DAISY_POSITION } from './complimentDaisyTarget';
import './ComplimentDaisy.css';

interface ComplimentDaisyTriggerProps {
  /**
   * Portal target — same atmosphere layer MemoryBubbles/OurTime use, for
   * two reasons: it sits above every scene's own overlay (letters, audio,
   * night sky, the dedicated "explore" scene), which otherwise blocks
   * clicks to anything underneath even where they're visually
   * transparent; and it isn't subject to the meadow's own slow camera
   * drift. See complimentDaisyTarget.ts for why this isn't one of the
   * meadow's own generated daisies.
   */
  atmosphereLayer: HTMLElement | null;
  /**
   * False for the whole loading screen — the daisy is still visible
   * (it's a real part of the field, after all), just plain and
   * untappable, identical to an ordinary daisy. True permanently from
   * the first time the meadow scene is actually reached onward, at
   * which point its color tint and glow fade in (see
   * easterEggsRevealed in MeadowScene.tsx).
   */
  revealed: boolean;
}

const MESSAGE_VISIBLE_MS = 3600;

/**
 * Shuffle-bag picker: hands out every compliment once, in a freshly
 * shuffled order, before reshuffling for the next round — so nothing
 * repeats until the whole list has been seen. Same technique as the
 * memory bubbles' memory picker.
 */
function createComplimentPicker(entries: typeof compliments) {
  let bag: typeof compliments = [];
  const refill = () => {
    bag = [...entries];
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      ;[bag[i], bag[j]] = [bag[j], bag[i]];
    }
  };
  return function next() {
    if (entries.length === 0) return null;
    if (bag.length === 0) refill();
    return bag.pop() ?? null;
  };
}

/**
 * The infinite compliment daisy. Tappable anywhere in the journey —
 * each tap reveals one more compliment near the bottom of the screen,
 * a small elegant line, not a popup, which fades in, holds briefly,
 * and fades away on its own.
 */
export function ComplimentDaisyTrigger({ atmosphereLayer, revealed }: ComplimentDaisyTriggerProps) {
  const [message, setMessage] = useState<{ text: string; key: number } | null>(null);
  const pickerRef = useRef(createComplimentPicker(compliments));
  const keyRef = useRef(0);
  const hideTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(hideTimerRef.current);
  }, []);

  if (!atmosphereLayer) return null;

  const handleTap = () => {
    const entry = pickerRef.current();
    if (!entry) return;
    keyRef.current += 1;
    setMessage({ text: entry.text, key: keyRef.current });
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setMessage(null), MESSAGE_VISIBLE_MS);
  };

  return createPortal(
    <>
      <button
        type="button"
        className={`compliment-daisy-trigger${revealed ? ' is-revealed' : ''}`}
        aria-label="a daisy"
        onClick={revealed ? handleTap : undefined}
        aria-hidden={!revealed}
        tabIndex={revealed ? 0 : -1}
        style={COMPLIMENT_DAISY_POSITION}
      >
        <GroundedFlowerBase />
        <DaisyGraphic />
      </button>

      {message && (
        <p key={message.key} className="compliment-daisy-message" role="status">
          {message.text}
        </p>
      )}
    </>,
    atmosphereLayer,
  );
}
