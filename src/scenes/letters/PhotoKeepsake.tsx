import { useState } from 'react';
import type { PhotoEntry } from '../../types/content';
import { getPhotoPlacement, hashString } from './photoLayout';
import './PhotoKeepsake.css';

/**
 * One embedded keepsake photo — a small tilted Polaroid-style frame with
 * a pin, and a graceful fallback (a simple frame icon, not a broken-image
 * glyph) if the file at `photo.src` isn't there yet. Shared by
 * `LetterPage.tsx` and `AudioScene.tsx` so both letters and the audio
 * scene can embed photos the same way — always through `PhotoCluster`
 * below, never mapped directly, so the stacked layout stays consistent.
 */
export function PhotoKeepsake({
  photo,
  index,
  solo = false,
}: {
  photo: PhotoEntry;
  index: number;
  /** True when this photo is alone on its row (1-photo pages, or the odd photo tucked below a pair) — sized a little larger. */
  solo?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const { rotationDeg, offsetY, offsetX } = getPhotoPlacement(photo.id, index);
  const style = {
    transform: `rotate(${rotationDeg}deg) translate(${offsetX}px, ${offsetY}px)`,
  };

  return (
    <figure className={`photo-keepsake${solo ? ' photo-keepsake--solo' : ' photo-keepsake--duo'}`} style={style}>
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

interface ClusterRow {
  photos: { photo: PhotoEntry; index: number }[];
  /** True for a lone trailing photo that should sit tucked slightly off-center under a pair above it, instead of dead-centered. */
  offCenter: boolean;
  offCenterDir: 'left' | 'right';
}

/**
 * Splits a page's photos into rows for `PhotoCluster`:
 *  - 1 photo: a single centered row.
 *  - 2 photos: both together on one row.
 *  - 3+ photos: pairs of two per row, with a leftover single photo (odd
 *    count) tucked on its own row, nudged left/right of center rather
 *    than dead-centered, so it reads as scattered rather than gridded.
 * Deterministic (hashes the row's own photo id for its left/right
 * nudge), so layout doesn't jump around on re-render.
 */
function groupPhotosForCluster(photos: PhotoEntry[]): ClusterRow[] {
  const rows: ClusterRow[] = [];
  let index = 0;
  let i = 0;

  if (photos.length <= 2) {
    rows.push({ photos: photos.map((photo) => ({ photo, index: index++ })), offCenter: false, offCenterDir: 'left' });
    return rows;
  }

  while (i < photos.length) {
    const remaining = photos.length - i;
    if (remaining === 1) {
      const photo = photos[i];
      rows.push({
        photos: [{ photo, index: index++ }],
        offCenter: true,
        offCenterDir: hashString(photo.id) % 2 === 0 ? 'left' : 'right',
      });
      i += 1;
    } else {
      const pair = photos.slice(i, i + 2).map((photo) => ({ photo, index: index++ }));
      rows.push({ photos: pair, offCenter: false, offCenterDir: 'left' });
      i += 2;
    }
  }

  return rows;
}

/**
 * Renders a page/scene's keepsake photos tucked in like a small
 * scattered stack instead of one-per-line: a lone photo sits centered,
 * a pair sits side by side, and three-plus split into pairs with any
 * odd one out nudged off-center below. All photo widths are set in %
 * of this container (see PhotoKeepsake.css) rather than fixed px, so
 * this always fits on narrow Android widths — it never falls back to
 * one-per-line the way a fixed-width flex-wrap row could.
 */
export function PhotoCluster({ photos }: { photos: PhotoEntry[] }) {
  if (photos.length === 0) return null;

  const rows = groupPhotosForCluster(photos);

  return (
    <div className="photo-keepsake-row">
      {rows.map((row) => {
        const rowClassName = [
          'photo-keepsake-row__line',
          row.offCenter && 'photo-keepsake-row__line--off-center',
          row.offCenter && `photo-keepsake-row__line--off-${row.offCenterDir}`,
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div className={rowClassName} key={row.photos.map(({ photo }) => photo.id).join('-')}>
            {row.photos.map(({ photo, index }) => (
              <PhotoKeepsake key={photo.id} photo={photo} index={index} solo={row.photos.length === 1} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
