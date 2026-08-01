import { lazy } from 'react';
import type { SceneRegistry } from './sceneTypes';

/**
 * The scene registry. To add or swap a scene's implementation, change the
 * import path here — nothing else in the app needs to know about it.
 * Components are lazy-loaded so heavier future scenes (meadow, audio)
 * don't bloat the initial bundle on Android.
 */
export const sceneRegistry: SceneRegistry = {
  loading: {
    id: 'loading',
    label: 'Loading',
    component: lazy(() => import('./loading/LoadingScene')),
  },
  meadow: {
    id: 'meadow',
    label: 'Meadow',
    component: lazy(() => import('./meadow/MeadowStepOverlay')),
  },
  envelope: {
    id: 'envelope',
    label: 'Envelope',
    component: lazy(() => import('./envelope/EnvelopeScene')),
  },
  letterOne: {
    id: 'letterOne',
    label: 'Letter One',
    component: lazy(() => import('./letters/LetterOneScene')),
  },
  audio: {
    id: 'audio',
    label: 'Audio',
    component: lazy(() => import('./audio/AudioScene')),
  },
  letterTwo: {
    id: 'letterTwo',
    label: 'Letter Two',
    component: lazy(() => import('./letters/LetterTwoScene')),
  },
  promiseTree: {
    id: 'promiseTree',
    label: 'Promise Tree',
    component: lazy(() => import('./ending/PromiseTreeScene')),
  },
  finalRest: {
    id: 'finalRest',
    label: 'Final Rest',
    component: lazy(() => import('./ending/FinalRestScene')),
  },
  explore: {
    id: 'explore',
    label: 'Explore',
    component: lazy(() => import('./explore/ExploreScene')),
  },
};
