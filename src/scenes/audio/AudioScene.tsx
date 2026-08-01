import { audioConfig } from '../../content/site';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';
import { CDPlayer } from './CDPlayer';
import { useAudioPlayer } from './audioControls';
import './AudioScene.css';

/**
 * The audio scene: a transparent overlay drawn on top of the one
 * persistent meadow mounted in `SceneManager` — same pattern as
 * `EnvelopeScene`/`LetterOneScene`. It renders no sky or background of
 * its own; the real meadow (with its own light, grass, butterflies) is
 * always what's showing behind the record player.
 *
 * The only thing this scene adds on top of the meadow is a soft dimming
 * scrim while the recording plays, so the world quiets down and the
 * player becomes the only thing that matters — without ever touching
 * the meadow itself.
 */
export default function AudioScene({ onNext }: SceneProps) {
  const player = useAudioPlayer();
  const { isPlaying, hasEnded } = player;

  return (
    <div className={`audio-scene${isPlaying ? ' is-playing' : ''}`}>
      <div className="audio-scene__scrim" aria-hidden="true" />

      <div className="audio-scene__content">
        <p className="audio-scene__eyebrow">
          {isPlaying ? 'the meadow grows quiet…' : 'a little something before the next page'}
        </p>

        <div className="audio-scene__garland" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className="audio-scene__bulb" style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </div>

        <CDPlayer audio={audioConfig} player={player} />
        <div className="audio-scene__ground-shadow" aria-hidden="true" />

        <p className="audio-scene__hint">
          {hasEnded
            ? 'that was for you'
            : isPlaying
              ? 'just this, for a few minutes'
              : 'tap the record, or press play — the story waits for you'}
        </p>

        <button type="button" className="audio-scene__continue" onClick={onNext}>
          <span className="audio-scene__continue-seal" aria-hidden="true" />
          <span>{buttonLabels.continue} to her letter</span>
        </button>
      </div>
    </div>
  );
}
