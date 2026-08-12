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
 * the meadow itself. Sized to sit comfortably within ~75% of the
 * viewport height, no scrolling required.
 */
export default function AudioScene({ onNext }: SceneProps) {
  const player = useAudioPlayer();
  const { isPlaying, hasEnded } = player;

  return (
    <div className={`audio-scene${isPlaying ? ' is-playing' : ''}`}>
      <div className="audio-scene__scrim" aria-hidden="true" />

      <div className="audio-scene__content">
        <p className="audio-scene__eyebrow">
          {isPlaying
            ? 'the meadow grows quiet…'
            : hasEnded
              ? ' '
              : 'a little something before the next page'}
        </p>

        <CDPlayer audio={audioConfig} player={player} />

        <button type="button" className="audio-scene__continue" onClick={onNext}>
          <span className="audio-scene__continue-seal" aria-hidden="true" />
          <span>{buttonLabels.continue} to her letter</span>
        </button>
      </div>
    </div>
  );
}
