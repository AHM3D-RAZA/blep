export interface Star {
  x: number
  y: number
  size: number
  twinkleDelay: number
  twinkleDuration: number
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
      size: 1 + rand() * 1.6,
      twinkleDelay: rand() * 8,
      twinkleDuration: 4 + rand() * 4, // 4–8s, slow and uneven rather than a fast metronome
    })
  }
  return stars
}
