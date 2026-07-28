import { ScenePlaceholder } from '../../components/ScenePlaceholder';
import { siteIdentity } from '../../content/site';
import type { SceneProps } from '../sceneTypes';

/**
 * Placeholder for the meadow scene — the continuous world base that
 * carries the sunrise-to-night lighting progression (per the project
 * bible). The `feat/meadow` module replaces this body; the scene id,
 * props, and registry entry stay the same.
 */
export default function MeadowScene({ onNext }: SceneProps) {
  return (
    <ScenePlaceholder sceneLabel="meadow" onNext={onNext}>
      <p>a small meadow, made for {siteIdentity.recipientName}</p>
    </ScenePlaceholder>
  );
}
