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
  startY: number
  duration: number
  delay: number
  dx: number // final horizontal displacement, vmin
  dy: number // final vertical displacement, vmin — can be negative (gust lifting it)
  wobbleX: number // perpendicular flutter, vmin
  wobbleY: number
  scale: number
  rotations: number
  colorFrom: string
  colorTo: string
}

// Yellow is half of all petals; white, pink, and red split the other half
// as evenly as the count allows. Built as a proportional set and shuffled
// (not drawn independently per petal) so a small handful can't randomly
// land on, say, three reds and zero of everything else — the same fix
// applied to butterfly wing colors, for the same reason.
const PETAL_COLORS: { from: string; to: string }[] = [
  { from: '#fff2c2', to: '#e6b23f' }, // yellow
  { from: '#ffffff', to: '#f3ecd9' }, // white
  { from: '#ffd9e6', to: '#ffb6c9' }, // pink
  { from: '#ffc9bd', to: '#dd6a56' }, // red
]

function buildPetalColors(count: number, rand: () => number) {
  const others = PETAL_COLORS.slice(1)
  const colors: { from: string; to: string }[] = []
  const yellowCount = Math.round(count / 2)
  for (let i = 0; i < count; i++) {
    colors.push(i < yellowCount ? PETAL_COLORS[0] : others[(i - yellowCount) % others.length])
  }
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[colors[i], colors[j]] = [colors[j], colors[i]]
  }
  return colors
}

// Sparse by design — petals should feel occasional, not like weather.
// Each one gets its own random travel angle (any direction — a breeze can
// carry a petal sideways or even briefly upward, not just straight down)
// plus a perpendicular wobble so the path flutters instead of running dead
// straight from A to B. They spawn from just outside the screen, along the
// reverse of their travel direction, so they visibly blow *in* rather than
// simply appearing mid-air.
export function generatePetals(count = 9, seed = 11): PetalDef[] {
  const rand = mulberry32(seed)
  const colors = buildPetalColors(count, rand)
  const petals: PetalDef[] = []
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2 // any direction at all
    const distance = 45 + rand() * 65 // vmin
    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance
    // perpendicular to the travel direction, for the side-to-side flutter
    const wobbleAmount = 8 + rand() * 14
    const wobbleX = -Math.sin(angle) * wobbleAmount
    const wobbleY = Math.cos(angle) * wobbleAmount

    // Spawn point: start from the center-ish, pushed backward (opposite the
    // travel direction) far enough that it lands outside the 0-100% box
    // regardless of aspect ratio — so it enters from off-screen and flies
    // *through* the meadow rather than materializing inside it.
    const reverseAngle = angle + Math.PI
    const spawnPush = 65 + rand() * 30
    const startX = 50 + Math.cos(reverseAngle) * spawnPush
    const startY = 50 + Math.sin(reverseAngle) * spawnPush

    const color = colors[i]

    petals.push({
      id: `petal-${i}`,
      startX,
      startY,
      duration: 8 + rand() * 9,
      // Capped lower than before (was up to 20s) so the first petal shows
      // up sooner instead of leaving the meadow looking empty at a glance.
      delay: rand() * 10,
      dx,
      dy,
      wobbleX,
      wobbleY,
      scale: 0.6 + rand() * 0.5,
      rotations: 1.5 + rand() * 3,
      colorFrom: color.from,
      colorTo: color.to,
    })
  }
  return petals
}
