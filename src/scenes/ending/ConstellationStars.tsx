import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { pseudoRandom, wordToPercentPoints } from './constellationText';
import './ConstellationStars.css';

interface ConstellationStarsProps {
  /** Once true, the scattered stars begin drifting into formation. */
  active: boolean;
  word: string;
}

// The band of sky these stars are laid out in — moved below the moon's
// resting spot (it settles at 20% from the top, see MOON_REST_Y in
// dayCycle.ts) so the two don't overlap, and still well clear of the
// firefly band below it.
const BOX = { leftPercent: 13, topPercent: 26, widthPercent: 74, heightPercent: 16 };

/**
 * A dedicated set of stars — same look as the meadow's own ambient ones —
 * that start scattered through the upper sky and drift into a word,
 * point by point, rather than ever being rendered as text. Left in place
 * afterward with a gentle twinkle, like a real constellation.
 */
export function ConstellationStars({ active, word }: ConstellationStarsProps) {
  // A bit more jitter/thinning than the default (which fireflies use as-
  // is) — "I LOVE YOU" is a much longer word, mostly straight strokes
  // (I, L, V, E, Y, U), which reads as a gridded sign far more easily
  // than a short, curvier word does at the same settings.
  const targets = useMemo(() => wordToPercentPoints(word, BOX, 0.27, 0.7), [word]);

  // Scattered starting positions — a pure function of each star's index,
  // not Math.random(), so this stays safe to compute during render.
  const starts = useMemo(
    () =>
      targets.map((_, i) => ({
        xPercent: 4 + pseudoRandom(i * 3 + 1) * 92,
        yPercent: 4 + pseudoRandom(i * 3 + 2) * 60,
        delay: pseudoRandom(i * 3 + 3) * 3.2,
      })),
    [targets],
  );

  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFormed = useRef(false);

  useEffect(() => {
    if (!active || hasFormed.current) return;
    const container = containerRef.current;
    if (!container) return;
    hasFormed.current = true;

    // Measured once, here, rather than reading layout every tick: the
    // gather motion itself animates a translate() offset (see
    // --gather-x/--gather-y in ConstellationStars.css) instead of
    // left/top directly, so it stays compositor-only and never forces
    // a layout recalc while it's running.
    const rect = container.getBoundingClientRect();
    const elements = refs.current;

    elements.forEach((el, i) => {
      if (!el) return;
      const target = targets[i];
      const start = starts[i];
      const dxPx = ((target.xPercent - start.xPercent) / 100) * rect.width;
      const dyPx = ((target.yPercent - start.yPercent) / 100) * rect.height;
      gsap.to(el, {
        '--gather-x': `${dxPx}px`,
        '--gather-y': `${dyPx}px`,
        duration: 4.4 + Math.random() * 2.6,
        delay: starts[i].delay,
        ease: 'sine.inOut',
        onComplete: () => el.classList.add('constellation-star--settled'),
      });
    });

    // Snapshotted above rather than re-read from refs.current here:
    // React nulls out individual ref callbacks before this cleanup
    // runs on unmount, so re-reading the ref array at this point could
    // silently skip killing some of these tweens.
    return () => {
      elements.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, [active, targets, starts]);

  return (
    <div className="constellation-stars" ref={containerRef} aria-hidden="true">
      {targets.map((target, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="constellation-star"
          style={{
            left: `${starts[i].xPercent}%`,
            top: `${starts[i].yPercent}%`,
            animationDelay: `${pseudoRandom(i * 11.7 + 4) * 4.5}s`,
            animationDuration: `${3.4 + pseudoRandom(i * 11.7 + 5) * 3.2}s`,
            '--star-scale': target.scale,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
