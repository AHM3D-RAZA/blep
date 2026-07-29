function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface WildflowerDef {
  id: string
  x: number // %
  y: number // % from bottom
  scale: number
  swayDelay: number
  hue: string
}

const WILDFLOWER_HUES = ['#c98fb0', '#8f9fd6', '#d6a15c', '#b3849e']

export function generateWildflowers(count = 16, seed = 51): WildflowerDef[] {
  const rand = mulberry32(seed)
  const flowers: WildflowerDef[] = []
  for (let i = 0; i < count; i++) {
    flowers.push({
      id: `wildflower-${i}`,
      x: rand() * 96 + 2,
      y: rand() * 5,
      scale: 0.5 + rand() * 0.4,
      swayDelay: rand() * 3,
      hue: WILDFLOWER_HUES[i % WILDFLOWER_HUES.length],
    })
  }
  return flowers
}
