function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface DustDef {
  id: string
  x: number
  y: number
  duration: number
  delay: number
  drift: number
  scale: number
}

export function generateDust(count = 18, seed = 33): DustDef[] {
  const rand = mulberry32(seed)
  const motes: DustDef[] = []
  for (let i = 0; i < count; i++) {
    motes.push({
      id: `dust-${i}`,
      x: rand() * 100,
      y: 20 + rand() * 60,
      duration: 9 + rand() * 7,
      delay: rand() * 10,
      drift: (rand() - 0.5) * 20,
      scale: 0.5 + rand() * 0.8,
    })
  }
  return motes
}
