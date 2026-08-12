import { Suspense, useCallback, useState } from 'react';
import { SceneFrame } from '../components/SceneFrame';
import { SceneTransition } from '../components/SceneTransition';
import MeadowScene from './meadow/MeadowScene';
import { advanceMeadowCheckpoint } from './meadow/dayCycle';
import { sceneRegistry } from './sceneRegistry';
import { SCENE_ORDER, type SceneId } from './sceneTypes';
import './SceneManager.css';

const FIRST_SCENE: SceneId = SCENE_ORDER[0];

// Per dayCycle.ts's DAY_CHECKPOINTS mapping (each checkpoint = 20% of the
// cycle, one per app "section"): leaving loading hands the meadow+envelope
// section its 20% (0.2->0.4), leaving envelope hands letterOne its 20%
// (0.4->0.6), leaving letterOne hands audio its 20% (0.6->0.8), leaving
// audio hands letterTwo the final 20% (0.8->1.0). meadow and letterTwo
// themselves don't trigger anything further — meadow's dwell time is
// covered by loading's advance, and 1.0 is already the max.
const CHECKPOINT_GATED_SCENES = new Set<SceneId>(['loading', 'envelope', 'letterOne', 'audio']);

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
  const [atmosphereLayer, setAtmosphereLayer] = useState<HTMLDivElement | null>(null);

  const goTo = useCallback(
    (next: SceneId) => {
      if (CHECKPOINT_GATED_SCENES.has(current)) advanceMeadowCheckpoint();
      setPrevious(current);
      setCurrent(next);
    },
    [current],
  );

  const goNext = useCallback(() => {
    const index = SCENE_ORDER.indexOf(current);
    const nextScene = SCENE_ORDER[index + 1] ?? current;
    if (CHECKPOINT_GATED_SCENES.has(current)) advanceMeadowCheckpoint();
    setPrevious(current);
    setCurrent(nextScene);
  }, [current]);

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
            atmosphereLayer={atmosphereLayer}
          />
        </div>

        <div className="scene-stage__overlay-layer">
          <Suspense fallback={<div className="scene-frame__loading" aria-hidden="true" />}>
            <SceneTransition activeKey={current}>
              <ActiveScene onNext={goNext} onGoTo={goTo} previousScene={previous} />
            </SceneTransition>
          </Suspense>
        </div>

        {/* Above the overlay: butterflies/petals/fireflies/dust get
            portaled in here from the persistent MeadowScene, so they fly
            in front of the envelope/letter card instead of being hidden
            behind it. Pointer-events stay off so they never block taps
            on the scene content beneath them. */}
        <div className="scene-stage__atmosphere-layer" ref={setAtmosphereLayer} />
      </div>
    </SceneFrame>
  );
}
