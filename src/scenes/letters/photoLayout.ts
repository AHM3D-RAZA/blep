/**
 * Gives each photo a small, deterministic tilt/offset so a row of
 * embedded keepsake photos looks hand-tucked rather than perfectly
 * aligned — same photo id always gets the same placement, so layout
 * doesn't jitter on re-render.
 */
export interface PhotoPlacement {
  /** Degrees of rotation, small and alternating either side of upright. */
  rotationDeg: number;
  /** Vertical offset in px, so photos don't all sit on one clean line. */
  offsetY: number;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getPhotoPlacement(id: string, index: number): PhotoPlacement {
  const hash = hashString(id);
  const direction = index % 2 === 0 ? 1 : -1;
  const rotationDeg = direction * (3 + (hash % 6));
  const offsetY = (hash % 5) - 2 + (index % 2 === 0 ? 0 : 6);
  return { rotationDeg, offsetY };
}
