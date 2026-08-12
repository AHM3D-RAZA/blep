function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface ButterflyDef {
  id: string
  startX: number
  startY: number
  driftX: number // horizontal wander range %
  driftY: number // vertical wander range %
  duration: number
  delay: number
  landOn?: string // optional daisy id to land near
  appearsAfter: number // 0–1 day-cycle progress this butterfly joins at
  hue: string
}

const WING_HUES = ['#f2a65a', '#e8e2d0', '#c96f9c', '#f7d774']

export function generateButterflies(count = 7, seed = 3): ButterflyDef[] {
  const rand = mulberry32(seed)
  const flies: ButterflyDef[] = []
  for (let i = 0; i < count; i++) {
    flies.push({
      id: `butterfly-${i}`,
      startX: rand() * 90 + 5,
      startY: 20 + rand() * 40,
      driftX: 15 + rand() * 20,
      driftY: 10 + rand() * 15,
      duration: 8 + rand() * 6,
      delay: rand() * 5,
      // Almost none at the very start (pre-dawn/sunrise) — they begin
      // trickling in as the transition into full morning happens, then
      // keep spreading out across most of the daylight portion.
      appearsAfter: 0.12 + (i / count) * 0.48,
      hue: WING_HUES[i % WING_HUES.length],
    })
  }
  return flies
}
