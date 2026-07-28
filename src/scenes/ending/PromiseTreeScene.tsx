import { ScenePlaceholder } from '../../components/ScenePlaceholder';
import type { SceneProps } from '../sceneTypes';

/**
 * Placeholder for the Promise Tree ending. The `feat/promise-eggs` module
 * replaces this with the tree, swing, hidden mailbox, and final note.
 */
export default function PromiseTreeScene({ onNext }: SceneProps) {
  return <ScenePlaceholder sceneLabel="promise tree" onNext={onNext} />;
}
