import { ScenePlaceholder } from '../../components/ScenePlaceholder';
import { audioConfig } from '../../content/site';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';

/**
 * Placeholder for the audio scene. The `feat/audio-letter2` module
 * replaces this with the custom vintage-style player. `audioConfig` in
 * `src/content/site.ts` already holds the track path/title to read from.
 */
export default function AudioScene({ onNext }: SceneProps) {
  return (
    <ScenePlaceholder sceneLabel={audioConfig.title} onNext={onNext} nextLabel={buttonLabels.continue} />
  );
}
