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

// Half of all butterflies are yellow; the other half is split evenly
// across these four. Built as a proportional set and shuffled (not drawn
// independently per butterfly) so a small flock can't randomly land on,
// say, four oranges and zero of everything else.
const YELLOW_HUE = '#f7d774'
const OTHER_HUES = ['#e8e2d0', '#c96f9c', '#a68fd1', '#f2a65a'] // white, pink, purple, orange

function buildWingHues(count: number, rand: () => number): string[] {
  const hues: string[] = []
  const yellowCount = Math.round(count / 2)
  for (let i = 0; i < count; i++) {
    hues.push(i < yellowCount ? YELLOW_HUE : OTHER_HUES[(i - yellowCount) % OTHER_HUES.length])
  }
  for (let i = hues.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[hues[i], hues[j]] = [hues[j], hues[i]]
  }
  return hues
}

export function generateButterflies(count = 7, seed = 3): ButterflyDef[] {
  const rand = mulberry32(seed)
  const wingHues = buildWingHues(count, rand)
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
      hue: wingHues[i],
    })
  }
  return flies
}
