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
// Heights are deliberately low — grass should read as a fringe along the
// bottom, not a wall that covers the daisies/sunflowers growing in it.
export const GRASS_LAYERS: GrassLayer[] = [
  { id: 'g-back', bottom: 0, height: 5, bladeCount: 46, hue: '#5a8353', swaySpeed: 4.2, opacity: 0.6 },
  { id: 'g-mid', bottom: 0, height: 7, bladeCount: 42, hue: '#4a7346', swaySpeed: 3.4, opacity: 0.8 },
  { id: 'g-front', bottom: 0, height: 9.5, bladeCount: 34, hue: '#3a6339', swaySpeed: 2.6, opacity: 1 },
]

export function bladePath(width: number, height: number, lean: number) {
  // simple tapered blade curve, `lean` biases the tip left/right
  const tipX = width / 2 + lean
  return `M0,${height} C${width * 0.1},${height * 0.5} ${tipX - 4},${height * 0.2} ${tipX},0 C${tipX + 4},${height * 0.2} ${width * 0.9},${height * 0.5} ${width},${height} Z`
}
