import { ScenePlaceholder } from '../../components/ScenePlaceholder';
import { letterOne } from '../../content/letters';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';

/**
 * Placeholder for the first letter scene. The `feat/envelope-letter1`
 * module replaces this with the handmade paper presentation, doodles,
 * and embedded photos. Content stays in `src/content/letters.ts`.
 */
export default function LetterOneScene({ onNext }: SceneProps) {
  return (
    <ScenePlaceholder sceneLabel={letterOne.title} onNext={onNext} nextLabel={buttonLabels.continue} />
  );
}
