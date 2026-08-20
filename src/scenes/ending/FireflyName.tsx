import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { pseudoRandom, wordToPercentPoints } from './constellationText';
import './FireflyName.css';

interface FireflyNameProps {
  /** Once true, fireflies begin gathering into the word. */
  active: boolean;
  word: string;
}

// A band low in the sky, above the meadow's own tree line, where the
// name settles — separate from the constellation band above it.
const BOX = { leftPercent: 26, topPercent: 47, widthPercent: 48, heightPercent: 12 };

/**
 * Warm fireflies — same look as the meadow's ambient ones — that gather
 * out of the dark and settle into a name, point by point. Each firefly
 * keeps a small idle wobble and flicker once in place so the name stays
 * visibly alive rather than freezing into static art.
 */
export function FireflyName({ active, word }: FireflyNameProps) {
  const targets = useMemo(() => wordToPercentPoints(word, BOX), [word]);

  // Scattered starting positions — a pure function of each firefly's
  // index, not Math.random(), so this stays safe to compute during render.
  const starts = useMemo(
    () =>
      targets.map((_, i) => ({
        xPercent: 8 + pseudoRandom(i * 5 + 11) * 84,
        yPercent: 55 + pseudoRandom(i * 5 + 12) * 30,
        delay: pseudoRandom(i * 5 + 13) * 3.5,
      })),
    [targets],
  );

  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const hasGathered = useRef(false);

  useEffect(() => {
    if (!active || hasGathered.current) return;
    hasGathered.current = true;

    refs.current.forEach((el, i) => {
      if (!el) return;
      const target = targets[i];
      gsap.to(el, {
        left: `${target.xPercent}%`,
        top: `${target.yPercent}%`,
        duration: 3.6 + Math.random() * 2.2,
        delay: starts[i].delay,
        ease: 'sine.inOut',
        onComplete: () => el.classList.add('firefly-name__dot--settled'),
      });
    });
  }, [active, targets, starts]);

  return (
    <div className="firefly-name" aria-hidden="true">
      {targets.map((target, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="firefly-name__dot"
          style={{
            left: `${starts[i].xPercent}%`,
            top: `${starts[i].yPercent}%`,
            animationDelay: `${(i % 9) * 0.4}s`,
            '--firefly-scale': target.scale,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
