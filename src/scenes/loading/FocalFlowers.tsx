import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SunflowerGraphic } from '../meadow/SunflowerGraphic';
import { DaisyGraphic } from '../meadow/DaisyGraphic';
import './FocalFlowers.css';

// How far the daisy leans toward the sunflower at rest, in degrees.
const DAISY_LEAN_DEG = 13;

interface FocalFlowersProps {
  className?: string;
  /** False fades the pair out (opacity + a gentle drift), for when dawn begins and they're no longer part of the scene. */
  visible?: boolean;
}

/**
 * The two focal flowers for the opening scene — center screen, growing
 * beside each other, quietly keeping each other company. Not the ambient
 * field (that's MeadowScene's job, hidden entirely during loading); this
 * is a dedicated pair reusing the same artwork (SunflowerGraphic/
 * DaisyGraphic) via its own sway behavior.
 *
 * The sway never runs on a fixed loop: each leg's GSAP tween picks a fresh
 * random target angle in its onComplete, the same non-repeating technique
 * used for the meadow's butterflies, so nothing here visibly repeats.
 */
export function FocalFlowers({ className, visible = true }: FocalFlowersProps) {
  const sunflowerRef = useRef<HTMLDivElement>(null);
  const daisyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sunNode = sunflowerRef.current;
    const daisyNode = daisyRef.current;
    if (!sunNode || !daisyNode) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.set(sunNode, { rotate: 0, transformOrigin: '50% 100%' });
    gsap.set(daisyNode, { rotate: DAISY_LEAN_DEG, transformOrigin: '50% 100%' });
    if (reduceMotion) return;

    let cancelled = false;

    // Heavier and taller — barely sways, stays close to upright, slow legs.
    const swaySunflower = () => {
      if (cancelled) return;
      const target = (Math.random() - 0.5) * 6; // roughly -3..3deg
      gsap.to(sunNode, {
        rotate: target,
        duration: 3.6 + Math.random() * 2.4,
        ease: 'sine.inOut',
        onComplete: swaySunflower,
      });
    };

    // Lighter — reacts more freely and quickly, wandering around its
    // lean-toward-the-sunflower rest angle rather than straight vertical.
    const swayDaisy = () => {
      if (cancelled) return;
      const target = DAISY_LEAN_DEG + (Math.random() - 0.5) * 14; // roughly 6..20deg
      gsap.to(daisyNode, {
        rotate: target,
        duration: 1.7 + Math.random() * 1.6,
        ease: 'sine.inOut',
        onComplete: swayDaisy,
      });
    };

    swaySunflower();
    swayDaisy();

    return () => {
      cancelled = true;
      gsap.killTweensOf(sunNode);
      gsap.killTweensOf(daisyNode);
    };
  }, []);

  return (
    <div className={`focal-flowers${visible ? '' : ' is-hidden'}${className ? ` ${className}` : ''}`}>
      <div ref={daisyRef} className="focal-flowers__daisy">
        <DaisyGraphic className="focal-flowers__daisy-svg" />
      </div>
      <div ref={sunflowerRef} className="focal-flowers__sunflower">
        <SunflowerGraphic className="focal-flowers__sunflower-svg" />
      </div>
    </div>
  );
}
