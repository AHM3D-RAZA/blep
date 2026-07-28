export interface GrassLayer {
  id: string
  bottom: number // % from bottom, negative allowed to bleed off-screen
  height: number // vh
  bladeCount: number
  hue: string
  swaySpeed: number // seconds per sway cycle
  opacity: number
}

// Back-to-front layers create depth; front layer sways fastest (closest to camera / wind).
export const GRASS_LAYERS: GrassLayer[] = [
  { id: 'g-back', bottom: 0, height: 14, bladeCount: 40, hue: '#4f7a4a', swaySpeed: 4.2, opacity: 0.65 },
  { id: 'g-mid', bottom: 0, height: 20, bladeCount: 36, hue: '#3f6b3d', swaySpeed: 3.4, opacity: 0.85 },
  { id: 'g-front', bottom: 0, height: 28, bladeCount: 30, hue: '#2f5a30', swaySpeed: 2.6, opacity: 1 },
]

export function bladePath(width: number, height: number, lean: number) {
  // simple tapered blade curve, `lean` biases the tip left/right
  const tipX = width / 2 + lean
  return `M0,${height} C${width * 0.1},${height * 0.5} ${tipX - 4},${height * 0.2} ${tipX},0 C${tipX + 4},${height * 0.2} ${width * 0.9},${height * 0.5} ${width},${height} Z`
}
