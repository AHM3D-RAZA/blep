import { useEffect, useState } from 'react';
import { loadingMessages, openingLine, openingAmbience } from '../../content/site';
import { MIN_LOADING_DURATION_MS } from '../sceneTiming';
import type { SceneProps } from '../sceneTypes';
import type { LoadingMessage } from '../../types/content';
import { FocalFlowers } from './FocalFlowers';
import { useAmbientAudio } from './useAmbientAudio';
import './LoadingScene.css';

// The whole point of this timing is to feel unhurried — a slow arrival,
// not a screen to get past. Nothing here is a spinner standing in for
// "please wait"; every beat is paced like part of the moment itself.
const HANDWRITTEN_DELAY_MS = 500; // tiny line appears shortly after the flowers settle in
const SENTENCE_DELAY_MS = 900; // the one sentence follows a beat later
const SENTENCE_FADE_MS = 1300;

// How often the small handwritten line swaps to a different random
// Easter-egg tease while it's on screen, and how long each swap's fade
// dip takes. HINT_DIP_MS deliberately matches the 900ms opacity
// transition already defined on .loading-scene__handwritten in the CSS,
// so the swap reuses that same fade rather than needing its own.
const HINT_CHANGE_INTERVAL_MS = 4200;
const HINT_DIP_MS = 900;
// Floor of guaranteed fully-visible time a hint gets before the final
// fade-out is allowed to cut it off — keeps the last swap from landing
// right on top of the flowers/sentence/handwritten fading away together.
const MIN_HINT_VISIBLE_MS = 900;

// The sun's cinematic rise (a compressed ~30s arc — see
// CHECKPOINT_LEG_SECONDS[0] and SUN_WINDOW in meadow/dayCycle.ts) crosses
// the horizon into view a little after the 1/3 mark of that arc and is
// clearly, warmly up well before the arc finishes climbing toward its
// checkpoint ceiling. This is timed to that moment, not a flat guess —
// flowers, the one sentence, and the handwritten line all stay put and
// hold together until the sun is actually visible, then fade as one.
const SUN_VISIBLE_DELAY_MS = 19000;
const SETTLE_PAUSE_MS = 3000; // brief quiet beat in the now sun-lit, uncluttered meadow before handing off

const FALLBACK_HANDWRITTEN: LoadingMessage = { id: 'loading-fallback', text: 'just a moment…' };

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Builds a `count`-long sequence of hints with no immediate repeats,
 * looping back through a fresh shuffle of the full list if `count`
 * outgrows it (nudging the seam so the loop-back item never matches the
 * one right before it). */
function buildHintSequence(count: number): LoadingMessage[] {
  const pool = loadingMessages.length > 0 ? loadingMessages : [FALLBACK_HANDWRITTEN];
  if (pool.length === 1) return Array(count).fill(pool[0]);
  const sequence: LoadingMessage[] = [];
  while (sequence.length < count) {
    const batch = shuffle(pool);
    if (sequence.length > 0 && batch[0].id === sequence[sequence.length - 1].id) {
      [batch[0], batch[1]] = [batch[1], batch[0]];
    }
    sequence.push(...batch);
  }
  return sequence.slice(0, count);
}

// Precomputed once at module scope: the wall-clock moments (from mount)
// at which the handwritten line dips out to swap to its next hint. Each
// entry needs enough room before SUN_VISIBLE_DELAY_MS for the dip-out,
// the swap, and MIN_HINT_VISIBLE_MS of settled visibility afterward.
const HINT_SWAP_TIMES: number[] = [];
for (
  let t = HANDWRITTEN_DELAY_MS + HINT_CHANGE_INTERVAL_MS;
  t + HINT_DIP_MS + MIN_HINT_VISIBLE_MS <= SUN_VISIBLE_DELAY_MS;
  t += HINT_CHANGE_INTERVAL_MS
) {
  HINT_SWAP_TIMES.push(t);
}

/**
 * The real meadow is already rendering behind this overlay (mounted once,
 * persistently, in SceneManager) — so "loading meadow" from the project
 * bible is literal: the person watches actual daisies and a sunflower in
 * the first light of dawn while this plays out, not a separate splash
 * screen. Per the opening-scene spec: exactly one sentence (fades in,
 * holds, fades away — no typing effect), and a single tiny handwritten
 * line below the flowers as the *only* loading indicator (no spinner, no
 * percentage, no bar).
 */
export default function LoadingScene({ onNext }: SceneProps) {
  const [hintSequence] = useState(() => buildHintSequence(HINT_SWAP_TIMES.length + 1));
  const [hintPos, setHintPos] = useState(0);
  const [hintDim, setHintDim] = useState(false);
  const handwritten = hintSequence[hintPos] ?? FALLBACK_HANDWRITTEN;

  const [showHandwritten, setShowHandwritten] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [showFlowers, setShowFlowers] = useState(true);
  const { stop: stopAmbience } = useAmbientAudio({ src: openingAmbience.src, targetVolume: openingAmbience.volume });

  useEffect(() => {
    const startedAt = performance.now();
    let cancelled = false;
    const timeouts: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(id);
    };

    schedule(() => setShowHandwritten(true), HANDWRITTEN_DELAY_MS);
    schedule(() => setShowSentence(true), SENTENCE_DELAY_MS);

    // Swap the handwritten line to its next hint at each precomputed
    // moment: dip it out, change the text once it's fully faded, dip it
    // back in — all riding the existing 900ms CSS opacity transition.
    HINT_SWAP_TIMES.forEach((t, i) => {
      schedule(() => setHintDim(true), t);
      schedule(() => {
        setHintPos(i + 1);
        setHintDim(false);
      }, t + HINT_DIP_MS);
    });

    // Flowers, sentence, and handwritten line all hold together and fade
    // out as one, once the sun is actually visible in the meadow below.
    schedule(() => {
      setShowSentence(false);
      setShowHandwritten(false);
      setShowFlowers(false);
    }, SUN_VISIBLE_DELAY_MS);

    // Hand-off point — after this, the meadow (which has been rendering
    // and progressing through its own dawn the entire time) just carries
    // on exactly as it always does.
    schedule(() => {
      stopAmbience();
      const elapsed = performance.now() - startedAt;
      const minRemaining = Math.max(0, MIN_LOADING_DURATION_MS - elapsed);
      schedule(onNext, minRemaining);
    }, SUN_VISIBLE_DELAY_MS + SENTENCE_FADE_MS + SETTLE_PAUSE_MS);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
    // hintSequence is memoized once per mount, onNext/stopAmbience are
    // stable — intentionally only re-running this on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="loading-scene">
      <FocalFlowers className="loading-scene__flowers" visible={showFlowers} />
      <p
        className={`loading-scene__sentence${showSentence ? ' is-visible' : ''}`}
        style={{ transitionDuration: `${SENTENCE_FADE_MS}ms` }}
      >
        {openingLine}
      </p>
      <p
        className={`loading-scene__handwritten${showHandwritten && !hintDim ? ' is-visible' : ''}`}
      >
        {handwritten.text}
      </p>
    </div>
  );
}
