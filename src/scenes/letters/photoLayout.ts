/**
 * Gives each photo a small, deterministic tilt/offset so a row of
 * embedded keepsake photos looks hand-tucked rather than perfectly
 * aligned — same photo id always gets the same placement, so layout
 * doesn't jitter on re-render.
 */
export interface PhotoPlacement {
  /** Degrees of rotation — alternates side to side photo-to-photo (see `index` below). */
  rotationDeg: number;
  /** Vertical offset in px, so photos don't all sit on one clean line. */
  offsetY: number;
  /** Small horizontal offset in px, so a pair of photos doesn't look perfectly ruler-straight. */
  offsetX: number;
}

export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * `index` is this photo's position among *all* photos rendered
 * together (not per-row) — that's what makes tilt direction alternate
 * photo-to-photo even when a cluster splits them across rows (see
 * `groupPhotosForCluster` in `PhotoKeepsake.tsx`).
 */
export function getPhotoPlacement(id: string, index: number): PhotoPlacement {
  const hash = hashString(id);
  const direction = index % 2 === 0 ? 1 : -1;
  const rotationDeg = direction * (4 + (hash % 6));
  const offsetY = (hash % 5) - 2 + (index % 2 === 0 ? 0 : 6);
  const offsetX = -direction * ((hash % 5) - 2);
  return { rotationDeg, offsetY, offsetX };
}
