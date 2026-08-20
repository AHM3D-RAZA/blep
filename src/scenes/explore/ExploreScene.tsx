import { ScenePlaceholder } from '../../components/ScenePlaceholder';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';

/**
 * Placeholder for the free-roam explore state, where hidden Easter eggs
 * can be found without disturbing the main story flow. Optional overlays
 * (`feat/promise-eggs`) mount on top of this scene.
 */
export default function ExploreScene({ onGoTo }: SceneProps) {
  return (
    <ScenePlaceholder sceneLabel="explore">
      <button type="button" className="scene-placeholder__button" onClick={() => onGoTo('nightSky')}>
        {buttonLabels.visitAgain}
      </button>
    </ScenePlaceholder>
  );
}
