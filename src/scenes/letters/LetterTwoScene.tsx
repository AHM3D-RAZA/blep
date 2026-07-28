import { ScenePlaceholder } from '../../components/ScenePlaceholder';
import { letterTwo } from '../../content/letters';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';

/**
 * Placeholder for the second letter scene. The `feat/audio-letter2`
 * module replaces this with the warmer, more reflective letter layout.
 */
export default function LetterTwoScene({ onNext }: SceneProps) {
  return (
    <ScenePlaceholder sceneLabel={letterTwo.title} onNext={onNext} nextLabel={buttonLabels.continue} />
  );
}
