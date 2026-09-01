import { useState } from 'react';
import type { PhotoEntry } from '../../types/content';
import { getPhotoPlacement } from './photoLayout';
import './PhotoKeepsake.css';

/**
 * One embedded keepsake photo — a small tilted Polaroid-style frame with
 * a pin, and a graceful fallback (a simple frame icon, not a broken-image
 * glyph) if the file at `photo.src` isn't there yet. Shared by
 * `LetterPage.tsx` and `AudioScene.tsx` so both letters and the audio
 * scene can embed photos the same way.
 */
export function PhotoKeepsake({ photo, index }: { photo: PhotoEntry; index: number }) {
  const [failed, setFailed] = useState(false);
  const { rotationDeg, offsetY } = getPhotoPlacement(photo.id, index);
  const style = {
    transform: `rotate(${rotationDeg}deg) translateY(${offsetY}px)`,
  };

  return (
    <figure className="photo-keepsake" style={style}>
      <div className="photo-keepsake__frame">
        {!failed ? (
          <img
            className="photo-keepsake__img"
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="photo-keepsake__fallback" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path
                d="M4 6h3l1.5-2h7L17 6h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
                fill="none"
                stroke="#b98f5e"
                strokeWidth="1.3"
              />
              <circle cx="12" cy="13" r="3.4" fill="none" stroke="#b98f5e" strokeWidth="1.3" />
            </svg>
          </div>
        )}
        <span className="photo-keepsake__pin" aria-hidden="true" />
      </div>
      {photo.caption && <figcaption className="photo-keepsake__caption">{photo.caption}</figcaption>}
    </figure>
  );
}
