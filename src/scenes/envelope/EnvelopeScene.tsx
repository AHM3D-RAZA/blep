import { Envelope } from './Envelope';
import type { SceneProps } from '../sceneTypes';
import './EnvelopeScene.css';

/**
 * The envelope scene: a transparent overlay drawn on top of the one
 * persistent meadow mounted in `SceneManager` — it renders no background
 * of its own, so the real meadow (with its own butterflies, petals, day
 * light) is always what's showing behind/around the envelope.
 */
export default function EnvelopeScene({ onNext }: SceneProps) {
  return (
    <div className="envelope-scene">
      <Envelope onReadLetter={onNext} />
    </div>
  );
}
