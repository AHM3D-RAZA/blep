import type { ComponentType, LazyExoticComponent } from 'react';

/**
 * The single source of truth for scene order. Add a new scene by adding
 * its id here, then registering a component for it in `sceneRegistry.ts`.
 * Nothing else in the app should define this list separately.
 */
export const SCENE_ORDER = [
  'loading',
  'meadow',
  'envelope',
  'letterOne',
  'audio',
  'letterTwo',
  'promiseTree',
  'finalRest',
  'explore',
] as const;

export type SceneId = (typeof SCENE_ORDER)[number];

/** Props every scene component receives from the SceneManager. */
export interface SceneProps {
  /** Advance to the next scene in SCENE_ORDER. No-op on the last scene. */
  onNext: () => void;
  /** Jump directly to any scene (used for replay / explore / Easter eggs). */
  onGoTo: (id: SceneId) => void;
  /** The scene immediately before this one, if any. */
  previousScene: SceneId | null;
}

export type SceneComponentType = ComponentType<SceneProps>;

export interface SceneDefinition {
  id: SceneId;
  /** Human-readable label, used for debugging/dev nav only. */
  label: string;
  component: LazyExoticComponent<SceneComponentType>;
}

export type SceneRegistry = Record<SceneId, SceneDefinition>;
