/**
 * Central timing values shared by the scene manager and its transition.
 * Individual scenes may define their own internal animation timings, but
 * anything affecting scene-to-scene handoff belongs here so it stays
 * consistent and easy to tune from one place.
 */
export const SCENE_TRANSITION_MS = 600;

/** Minimum time the loading scene stays visible, even if assets are ready sooner. */
export const MIN_LOADING_DURATION_MS = 1200;
