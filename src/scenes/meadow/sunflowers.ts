function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface SunflowerDef {
  id: string
  x: number // %
  y: number // % from bottom
  scale: number
  swayDelay: number
}

export function generateSunflowers(count = 6, seed = 19): SunflowerDef[] {
  const rand = mulberry32(seed)
  const flowers: SunflowerDef[] = []
  for (let i = 0; i < count; i++) {
    flowers.push({
      id: `sunflower-${i}`,
      x: rand() * 90 + 5,
      y: rand() * 6, // taller stems, rooted low
      scale: 1 + rand() * 0.5,
      swayDelay: rand() * 3,
    })
  }
  return flowers
}
