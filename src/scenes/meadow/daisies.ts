function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface DaisyDef {
  id: string
  x: number // %
  y: number // % from bottom (within grass band)
  scale: number
  swayDelay: number
  canLandOn: boolean // eligible for butterfly-landing behavior
}

export function generateDaisies(count = 22, seed = 7): DaisyDef[] {
  const rand = mulberry32(seed)
  const daisies: DaisyDef[] = []
  for (let i = 0; i < count; i++) {
    daisies.push({
      id: `daisy-${i}`,
      x: rand() * 96 + 2,
      y: rand() * 4, // stay rooted near the grass line, not floating above it
      scale: 0.7 + rand() * 0.6,
      swayDelay: rand() * 3,
      canLandOn: rand() > 0.4,
    })
  }
  return daisies
}
