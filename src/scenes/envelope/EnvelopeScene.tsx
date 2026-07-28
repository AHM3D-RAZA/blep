import { ScenePlaceholder } from '../../components/ScenePlaceholder';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';

/**
 * Placeholder for the envelope scene. The `feat/envelope-letter1` module
 * replaces this with the handcrafted envelope, wax seal, and tap-to-open
 * reveal described in the project bible.
 */
export default function EnvelopeScene({ onNext }: SceneProps) {
  return (
    <ScenePlaceholder sceneLabel="envelope" onNext={onNext} nextLabel={buttonLabels.openEnvelope} />
  );
}
