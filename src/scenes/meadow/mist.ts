function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface MistBankDef {
  id: string
  x: number // %
  bottom: number // vh
  width: number // vw
  height: number // vh
  duration: number // seconds for one drift cycle
  delay: number
  opacity: number
}

// A handful of overlapping soft banks rather than one flat layer, so the
// mist reads as uneven and drifting instead of a single gray strip.
export function generateMistBanks(count = 5, seed = 61): MistBankDef[] {
  const rand = mulberry32(seed)
  const banks: MistBankDef[] = []
  for (let i = 0; i < count; i++) {
    banks.push({
      id: `mist-${i}`,
      x: rand() * 90 - 10,
      bottom: rand() * 4,
      width: 55 + rand() * 45,
      height: 8 + rand() * 7,
      duration: 34 + rand() * 22,
      delay: -rand() * 40,
      opacity: 0.4 + rand() * 0.35,
    })
  }
  return banks
}
