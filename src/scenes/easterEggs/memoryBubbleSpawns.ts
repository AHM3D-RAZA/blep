import type { MemoryEntry } from '../../types/content'

// Kept deliberately rare — "must be rare... should NOT constantly
// appear" per the Easter egg spec — unlike the meadow's own ambient
// petals/fireflies, which are a constant weather effect. Nudged a bit
// more frequent than the original spacing (per feedback that bubbles
// felt too sparse), while staying clearly occasional rather than
// constant.
export const FIRST_DELAY_RANGE: [number, number] = [8, 16] // seconds, before the very first bubble
export const INTERVAL_RANGE: [number, number] = [18, 30] // seconds, between one bubble's end and the next spawn
const LIFETIME_RANGE: [number, number] = [16, 22] // seconds a bubble drifts before dissolving unpopped — slow, like an actual bubble

function randomBetween([min, max]: [number, number]): number {
  return min + Math.random() * (max - min)
}

export function randomDelay(range: [number, number]): number {
  return randomBetween(range)
}

export interface BubbleSpawn {
  id: string
  x: number // 8-90%, kept off the very edges
  drift: number // small horizontal wander over the rise, vmin
  duration: number // seconds
}

let bubbleCounter = 0

/** One new bubble, positioned clear of the very edges of the screen. */
export function spawnBubble(): BubbleSpawn {
  bubbleCounter += 1
  return {
    id: `memory-bubble-${bubbleCounter}-${Date.now()}`,
    x: 8 + Math.random() * 82,
    drift: (Math.random() - 0.5) * 14,
    duration: randomBetween(LIFETIME_RANGE),
  }
}

/**
 * Shuffle-bag memory picker: hands out every memory once, in a freshly
 * shuffled order, before reshuffling for the next round — so nothing
 * repeats until the whole set has been seen.
 */
export function createMemoryPicker(entries: MemoryEntry[]) {
  let bag: MemoryEntry[] = []

  const refill = () => {
    bag = [...entries]
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[bag[i], bag[j]] = [bag[j], bag[i]]
    }
  }

  return function next(): MemoryEntry | null {
    if (entries.length === 0) return null
    if (bag.length === 0) refill()
    return bag.pop() ?? null
  }
}
