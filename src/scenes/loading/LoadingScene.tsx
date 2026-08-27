import { useEffect, useState } from 'react';
import { loadingMessages, openingLine, openingAmbience } from '../../content/site';
import { MIN_LOADING_DURATION_MS } from '../sceneTiming';
import type { SceneProps } from '../sceneTypes';
import { FocalFlowers } from './FocalFlowers';
import { useAmbientAudio } from './useAmbientAudio';
import './LoadingScene.css';

// The whole point of this timing is to feel unhurried — a slow arrival,
// not a screen to get past. Nothing here is a spinner standing in for
// "please wait"; every beat is paced like part of the moment itself.
const HANDWRITTEN_DELAY_MS = 500; // tiny line appears shortly after the flowers settle in
const SENTENCE_DELAY_MS = 900; // the one sentence follows a beat later
const SENTENCE_HOLD_MS = 4200; // "leave it visible for several seconds"
const SENTENCE_FADE_MS = 1300;
const SETTLE_PAUSE_MS = 12000; // "no abrupt transition" — sit in the dim, quiet meadow a while before handing off; long enough for the sunrise (a 30s cinematic arc — see DAY_CHECKPOINTS/CHECKPOINT_LEG_SECONDS in meadow/dayCycle.ts) to have visibly progressed by handoff, not just barely started

const FALLBACK_HANDWRITTEN = { id: 'loading-fallback', text: 'just a moment…' };

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
  const [handwritten] = useState(() => {
    if (loadingMessages.length === 0) return FALLBACK_HANDWRITTEN;
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  });

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
    schedule(() => {
      setShowSentence(false);
      setShowHandwritten(false);
      setShowFlowers(false);
    }, SENTENCE_DELAY_MS + SENTENCE_FADE_MS + SENTENCE_HOLD_MS);

    // Hand-off point — after this, the meadow (which has been rendering
    // and progressing through its own dawn the entire time) just carries
    // on exactly as it always does.
    schedule(() => {
      stopAmbience();
      const elapsed = performance.now() - startedAt;
      const minRemaining = Math.max(0, MIN_LOADING_DURATION_MS - elapsed);
      schedule(onNext, minRemaining);
    }, SENTENCE_DELAY_MS + SENTENCE_FADE_MS + SENTENCE_HOLD_MS + SENTENCE_FADE_MS + SETTLE_PAUSE_MS);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
    // handwritten is memoized once per mount, onNext/stopAmbience are
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
        className={`loading-scene__handwritten${showHandwritten ? ' is-visible' : ''}`}
      >
        {handwritten.text}
      </p>
    </div>
  );
}
