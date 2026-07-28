import { Suspense, useCallback, useState } from 'react';
import { SceneFrame } from '../components/SceneFrame';
import { SceneTransition } from '../components/SceneTransition';
import { sceneRegistry } from './sceneRegistry';
import { SCENE_ORDER, type SceneId } from './sceneTypes';

const FIRST_SCENE: SceneId = SCENE_ORDER[0];

/**
 * The single source of truth for scene progression, per the project
 * bible. No scrolling drives the sequence — only `onNext` / `onGoTo`
 * calls made by the active scene itself.
 *
 * Later modules never need to touch this file: build a scene component,
 * register it in `sceneRegistry.ts`, and it plugs straight in.
 */
export function SceneManager() {
  const [current, setCurrent] = useState<SceneId>(FIRST_SCENE);
  const [previous, setPrevious] = useState<SceneId | null>(null);

  const goTo = useCallback((next: SceneId) => {
    setCurrent((prevCurrent) => {
      setPrevious(prevCurrent);
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    setCurrent((prevCurrent) => {
      const index = SCENE_ORDER.indexOf(prevCurrent);
      const nextScene = SCENE_ORDER[index + 1] ?? prevCurrent;
      setPrevious(prevCurrent);
      return nextScene;
    });
  }, []);

  const { component: ActiveScene } = sceneRegistry[current];

  return (
    <SceneFrame>
      <Suspense fallback={<div className="scene-frame__loading" aria-hidden="true" />}>
        <SceneTransition activeKey={current}>
          <ActiveScene onNext={goNext} onGoTo={goTo} previousScene={previous} />
        </SceneTransition>
      </Suspense>
    </SceneFrame>
  );
}
