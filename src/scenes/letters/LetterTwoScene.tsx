import { useRef, useState } from 'react';
import gsap from 'gsap';
import { LetterPage } from './LetterPage';
import { letterTwo } from '../../content/letters';
import { photos } from '../../content/photos';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';
import './LetterTwoScene.css';

const letterTwoPhotos = photos.filter((photo) => photo.id === 'photo-2');

const FOLD_DURATION = 0.55;
const MORPH_DURATION = 0.9;
const FLIGHT_LEGS = 5;

/**
 * The second letter scene: a transparent overlay on top of the
 * persistent meadow — same pattern as `LetterOneScene`, reusing the
 * shared `LetterPage` keepsake (paper texture, moon/vine/flower
 * doodles, embedded photo). Warmer and more reflective than the first
 * letter comes through in the content itself (`letterTwo` in
 * `src/content/letters.ts`).
 *
 * Its "continue" control is replaced with "One Last Thing...", which
 * folds the paper closed and then turns that same folded paper into a
 * small lantern — not a separate graphic swapped in, the sheet itself
 * narrows into a lantern silhouette, its rib lines and caps (rendered as
 * children of `LetterPage`, invisible until this plays) fade in, and it
 * drifts up into the night sky before advancing into `NightSkyScene`.
 *
 * The flight is deliberately NOT a single straight vector — a lantern
 * drifting on real air currents sways and wanders, it doesn't fly like a
 * plane. It's built from several randomized legs: each one rises a bit,
 * sways left or right by a random amount, and tilts slightly, all eased
 * in and out — the sum reads as an organic, unhurried drift.
 */
export default function LetterTwoScene({ onNext }: SceneProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [transitioning, setTransitioning] = useState(false);

  const handleOneLastThing = () => {
    const sheet = sheetRef.current;
    if (!sheet || transitioning) return;
    setTransitioning(true);

    const scroll = sheet.querySelector<HTMLElement>('.letter-page__scroll');
    const doodles = sheet.querySelectorAll<HTMLElement>('.letter-page__doodle');
    const texture = sheet.querySelector<HTMLElement>('.letter-page__sheet-texture');
    const lanternDetails = sheet.querySelectorAll<HTMLElement>('.lantern-detail');

    gsap.set(sheet, { transformOrigin: '50% 50%' });

    const tl = gsap.timeline({ onComplete: onNext });

    // fold the page closed
    tl.to([scroll, ...Array.from(doodles), texture], { opacity: 0, duration: 0.3, ease: 'power1.in' }, 0)
      .to(sheet, { scaleY: 0.05, duration: FOLD_DURATION, ease: 'power2.in' }, 0.05);

    // the same folded paper narrows into a lantern silhouette — a tall
    // barrel shape, not a circle — and its cap/rib details fade in. The
    // border-radius is set once (in %) right as the resize starts, so it
    // stays proportionally correct as the box shrinks, rather than being
    // (imperfectly) tweened itself.
    const morphStart = FOLD_DURATION + 0.05;
    tl.set(sheet, { borderRadius: '45% 45% 45% 45% / 14% 14% 14% 14%' }, morphStart)
      .to(
        sheet,
        {
          width: 40,
          height: 62,
          scaleY: 1,
          backgroundColor: '#ffd27a',
          boxShadow: '0 0 22px 9px rgba(255, 200, 130, 0.55)',
          duration: MORPH_DURATION,
          ease: 'power2.inOut',
        },
        morphStart,
      )
      .to(lanternDetails, { opacity: 1, duration: MORPH_DURATION * 0.6 }, morphStart + MORPH_DURATION * 0.35);

    // the swaying, unhurried climb — several randomized legs rather than
    // one straight path, so it wanders like it's actually on the wind
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    let cumulativeY = 0;
    let cursor = morphStart + MORPH_DURATION;
    let lastLegDuration = 1.2;

    for (let i = 0; i < FLIGHT_LEGS; i++) {
      const legRise = vh * (0.1 + Math.random() * 0.05);
      cumulativeY -= legRise;
      const sway = (Math.random() - 0.5) * vw * 0.18;
      const rotate = (Math.random() - 0.5) * 12;
      const duration = 1.3 + Math.random() * 0.7;
      lastLegDuration = duration;

      tl.to(
        sheet,
        {
          y: cumulativeY,
          x: `+=${sway}`,
          rotate,
          duration,
          ease: 'sine.inOut',
        },
        cursor,
      );
      cursor += duration;
    }

    // fade out gently over the last stretch of the climb
    tl.to(sheet, { opacity: 0, duration: Math.min(1.1, lastLegDuration) }, cursor - Math.min(1.1, lastLegDuration));
  };

  return (
    <div className={`letter-two-scene ${transitioning ? 'letter-two-scene--transitioning' : ''}`}>
      <LetterPage
        letter={letterTwo}
        photos={letterTwoPhotos}
        onContinue={handleOneLastThing}
        continueLabel={buttonLabels.oneLastThing}
        sheetRef={sheetRef}
      >
        {/* Invisible until the fold-to-lantern morph fades it in (see
            handleOneLastThing above) — top cap + loop, two rib lines,
            bottom cap + tassel, drawn to match the barrel silhouette the
            sheet narrows into. */}
        <div className="lantern-detail lantern-detail--loop" aria-hidden="true" />
        <div className="lantern-detail lantern-detail--cap-top" aria-hidden="true" />
        <div className="lantern-detail lantern-detail--rib lantern-detail--rib-left" aria-hidden="true" />
        <div className="lantern-detail lantern-detail--rib lantern-detail--rib-right" aria-hidden="true" />
        <div className="lantern-detail lantern-detail--cap-bottom" aria-hidden="true" />
        <div className="lantern-detail lantern-detail--tassel" aria-hidden="true" />
      </LetterPage>
    </div>
  );
}
