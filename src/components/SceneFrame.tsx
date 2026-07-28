import type { ReactNode } from 'react';
import './SceneFrame.css';

interface SceneFrameProps {
  children: ReactNode;
}

/**
 * The single persistent, full-viewport container the whole app lives in.
 * Mobile-first: fills the dynamic viewport height, respects safe-area
 * insets, and never scrolls the scene sequence. Individual scenes render
 * their own content inside this frame via SceneManager.
 */
export function SceneFrame({ children }: SceneFrameProps) {
  return <div className="scene-frame">{children}</div>;
}
