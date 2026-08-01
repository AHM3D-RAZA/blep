function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface PetalDef {
  id: string
  startX: number
  duration: number
  delay: number
  drift: number
  scale: number
  rotations: number
}

// Sparse by design — petals should feel occasional, not like weather.
export function generatePetals(count = 5, seed = 11): PetalDef[] {
  const rand = mulberry32(seed)
  const petals: PetalDef[] = []
  for (let i = 0; i < count; i++) {
    petals.push({
      id: `petal-${i}`,
      startX: rand() * 100,
      duration: 10 + rand() * 8,
      delay: rand() * 20,
      drift: (rand() - 0.5) * 30,
      scale: 0.6 + rand() * 0.5,
      rotations: 2 + rand() * 3,
    })
  }
  return petals
}
