import type { ReactNode } from 'react';
import { buttonLabels } from '../content/buttons';
import './ScenePlaceholder.css';

interface ScenePlaceholderProps {
  sceneLabel: string;
  onNext?: () => void;
  nextLabel?: string;
  children?: ReactNode;
}

/**
 * Generic placeholder body used by every scene wrapper until its real
 * module (meadow visuals, envelope art, letters, audio, etc.) is built.
 * Later modules should delete the <ScenePlaceholder> usage inside their
 * scene file and render real content instead — the scene file, its props,
 * and its place in the registry all stay the same.
 */
export function ScenePlaceholder({
  sceneLabel,
  onNext,
  nextLabel,
  children,
}: ScenePlaceholderProps) {
  return (
    <div className="scene-placeholder">
      <span className="scene-placeholder__badge">placeholder</span>
      <h1 className="scene-placeholder__title">{sceneLabel}</h1>
      {children}
      {onNext && (
        <button type="button" className="scene-placeholder__button" onClick={onNext}>
          {nextLabel ?? buttonLabels.next}
        </button>
      )}
    </div>
  );
}
