import { ScenePlaceholder } from '../../components/ScenePlaceholder';
import { loadingMessages } from '../../content/site';
import type { SceneProps } from '../sceneTypes';

/**
 * Placeholder for the loading scene. The real module should cycle through
 * `loadingMessages` with no spinner and no percentage, per the project
 * bible, then call `onNext()` once the app is ready.
 */
export default function LoadingScene({ onNext }: SceneProps) {
  return (
    <ScenePlaceholder sceneLabel="loading" onNext={onNext}>
      <p>{loadingMessages[0]?.text}</p>
    </ScenePlaceholder>
  );
}
