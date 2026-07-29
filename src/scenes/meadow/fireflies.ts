function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface FireflyDef {
  id: string
  x: number
  y: number
  driftX: number
  driftY: number
  duration: number
  delay: number
  pulseDuration: number
}

export function generateFireflies(count = 9, seed = 27): FireflyDef[] {
  const rand = mulberry32(seed)
  const flies: FireflyDef[] = []
  for (let i = 0; i < count; i++) {
    flies.push({
      id: `firefly-${i}`,
      x: rand() * 100,
      y: 30 + rand() * 55,
      driftX: 6 + rand() * 10,
      driftY: 6 + rand() * 10,
      duration: 9 + rand() * 6,
      delay: rand() * 8,
      pulseDuration: 3.5 + rand() * 3,
    })
  }
  return flies
}
