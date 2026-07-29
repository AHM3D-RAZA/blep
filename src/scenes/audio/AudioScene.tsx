import { useEffect, useMemo, useState } from 'react';
import { audioConfig } from '../../content/site';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';
import { CDPlayer } from './CDPlayer';
import { useAudioPlayer } from './audioControls';
import './AudioScene.css';

const SPARKLE_COUNT = 14;

/**
 * A small, cozy nook tucked into the meadow — the whole point of this
 * scene is to feel quiet and intimate, with the recording as the only
 * thing that matters. When playback starts, the space itself settles:
 * dimmer, softer, fewer distractions.
 */
export default function AudioScene({ onNext }: SceneProps) {
  const player = useAudioPlayer();
  const { isPlaying, hasEnded } = player;
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (!hasEnded) return;
    const timer = setTimeout(() => setShowContinue(true), 700);
    return () => clearTimeout(timer);
  }, [hasEnded]);

  const sparkles = useMemo(
    () =>
      Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        delay: `${(i % 7) * 0.6}s`,
        duration: `${4 + (i % 5)}s`,
      })),
    [],
  );

  return (
    <div className={`audio-scene${isPlaying ? ' is-playing' : ''}`}>
      <div className="audio-scene__sky" aria-hidden="true" />

      <div className="audio-scene__sparkles" aria-hidden="true">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="audio-scene__sparkle"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          />
        ))}
      </div>

      <div className="audio-scene__hollow" aria-hidden="true">
        <div className="audio-scene__blanket" />
        <div className="audio-scene__lights">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className="audio-scene__bulb" style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </div>
      </div>

      <div className="audio-scene__vignette" aria-hidden="true" />

      <div className="audio-scene__content">
        <p className="audio-scene__eyebrow">
          {isPlaying ? 'the meadow grows quiet…' : 'a little something before the next page'}
        </p>

        <CDPlayer audio={audioConfig} player={player} />

        <p className="audio-scene__hint">
          {isPlaying
            ? 'just this, for a few minutes'
            : 'tap the record, or press play — the story waits for you'}
        </p>

        <button
          type="button"
          className={`audio-scene__continue${showContinue ? ' is-visible' : ''}`}
          onClick={onNext}
        >
          {buttonLabels.continue} to her letter
        </button>
      </div>
    </div>
  );
}
