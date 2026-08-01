import { Suspense, useCallback, useState } from 'react';
import { SceneFrame } from '../components/SceneFrame';
import { SceneTransition } from '../components/SceneTransition';
import MeadowScene from './meadow/MeadowScene';
import { sceneRegistry } from './sceneRegistry';
import { SCENE_ORDER, type SceneId } from './sceneTypes';
import './SceneManager.css';

const FIRST_SCENE: SceneId = SCENE_ORDER[0];

/**
 * The single source of truth for scene progression, per the project
 * bible. No scrolling drives the sequence — only `onNext` / `onGoTo`
 * calls made by the active scene itself.
 *
 * The meadow is mounted here exactly once, for the whole app session, and
 * is never part of the scene crossfade below it — its day/night cycle
 * must never restart or fade. Every scene from `envelope` onward is a
 * transparent foreground overlay drawn on top of that one persistent
 * meadow; only the overlay crossfades, never the meadow itself.
 *
 * Later modules never need to touch this file: build a scene component,
 * register it in `sceneRegistry.ts`, and it plugs straight in as an
 * overlay on top of the meadow.
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
      <div className="scene-stage">
        <div className="scene-stage__meadow-layer">
          <MeadowScene
            interactive={current === 'meadow'}
            onNext={goNext}
            onGoTo={goTo}
            previousScene={previous}
          />
        </div>

        <div className="scene-stage__overlay-layer">
          <Suspense fallback={<div className="scene-frame__loading" aria-hidden="true" />}>
            <SceneTransition activeKey={current}>
              <ActiveScene onNext={goNext} onGoTo={goTo} previousScene={previous} />
            </SceneTransition>
          </Suspense>
        </div>
      </div>
    </SceneFrame>
  );
}
