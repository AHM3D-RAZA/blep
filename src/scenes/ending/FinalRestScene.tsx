import { ScenePlaceholder } from '../../components/ScenePlaceholder';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';

/**
 * Placeholder for the closing rest state — replay / download / visit-again
 * controls live here once the `feat/promise-eggs` module lands.
 */
export default function FinalRestScene({ onGoTo }: SceneProps) {
  return (
    <ScenePlaceholder sceneLabel="final rest">
      <button type="button" className="scene-placeholder__button" onClick={() => onGoTo('loading')}>
        {buttonLabels.replay}
      </button>
    </ScenePlaceholder>
  );
}
