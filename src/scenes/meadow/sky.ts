// Deterministic star scatter so the field doesn't reshuffle on re-render.
export interface Star {
  x: number
  y: number
  size: number
  twinkleDelay: number
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateStars(count: number, seed = 42): Star[] {
  const rand = mulberry32(seed)
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 55, // keep stars in the upper sky
      size: 1 + rand() * 1.8,
      twinkleDelay: rand() * 6,
    })
  }
  return stars
}
