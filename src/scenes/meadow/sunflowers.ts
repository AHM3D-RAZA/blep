export interface SunflowerDef {
  id: string
  x: number // %
  y: number // % from bottom
  scale: number
  swayDelay: number
}

/**
 * A single sunflower, placed as a focal companion element rather than a
 * scattered group — daisies carry the field, this is the one warm anchor.
 */
export function generateSunflowers(): SunflowerDef[] {
  return [{ id: 'sunflower-0', x: 74, y: 1.5, scale: 1.3, swayDelay: 0.4 }]
}
