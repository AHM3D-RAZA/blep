import type { ReactNode } from 'react';
import { SCENE_TRANSITION_MS } from '../scenes/sceneTiming';
import './SceneTransition.css';

interface SceneTransitionProps {
  /** Unique key for the currently displayed scene, e.g. the SceneId. */
  activeKey: string;
  children: ReactNode;
}

/**
 * Simple crossfade between whatever `children` is rendered for the current
 * `activeKey`. Remounting on `key` change lets a plain CSS fade-in
 * animation run automatically, so no transition state needs to live in
 * React. Deliberately dependency-free — later scenes are free to layer
 * GSAP on top of their own internals.
 */
export function SceneTransition({ activeKey, children }: SceneTransitionProps) {
  return (
    <div
      key={activeKey}
      className="scene-transition"
      style={{ animationDuration: `${SCENE_TRANSITION_MS}ms` }}
    >
      {children}
    </div>
  );
}
