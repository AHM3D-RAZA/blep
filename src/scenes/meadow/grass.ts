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
  { id: 'g-back', bottom: 0, height: 4, bladeCount: 50, hue: '#5a8353', swaySpeed: 4.2, opacity: 0.6 },
  { id: 'g-mid', bottom: 0, height: 5.5, bladeCount: 46, hue: '#4a7346', swaySpeed: 3.4, opacity: 0.8 },
  { id: 'g-front', bottom: 0, height: 7, bladeCount: 38, hue: '#3a6339', swaySpeed: 2.6, opacity: 1 },
]

export function bladePath(width: number, height: number, lean: number) {
  // A thin tapered blade: narrow base, gentle curve up to a near-point tip.
  // Control-point offsets are proportional to `width` (not fixed), so the
  // blade never flares wider than its own base — that fixed-offset bug is
  // what made grass look like fat cartoon wedges before.
  const half = width / 2
  const tipX = half + lean
  const ctrl1X = half * 0.35 + lean * 0.4
  const ctrl2X = half * 1.65 + lean * 0.6
  return `M0,${height} C${ctrl1X},${height * 0.55} ${tipX - width * 0.12},${height * 0.15} ${tipX},0 C${tipX + width * 0.12},${height * 0.15} ${ctrl2X},${height * 0.55} ${width},${height} Z`
}
