import gsap from 'gsap'

export type DayPhase =
  | 'sunrise'
  | 'morning'
  | 'goldenHour'
  | 'sunset'
  | 'night'

export interface DayCycleStop {
  /** 0–1 position along the whole cycle */
  t: number
  phase: DayPhase
  /** gradient stops, evenly spaced top→bottom — all stops arrays must be the same length */
  sky: string[]
  sunOpacity: number
  moonOpacity: number
  starOpacity: number
  fireflyOpacity: number
  /** golden-hour dust motes — should be 0 by night, this isn't ambient light */
  dustOpacity: number
  glowTint: string // ambient light wash over the scene
}

export const SKY_STOP_COUNT = 4

export const DAY_CYCLE_STOPS: DayCycleStop[] = [
  {
    // Dawn: cool lavender blue up top settling into blush and warm gold
    // near the horizon — a real dawn has that color band, not one flat hue.
    t: 0,
    phase: 'sunrise',
    sky: ['#7c8fb5', '#b98ca3', '#e8a87e', '#f6d9a8'],
    sunOpacity: 0.8,
    moonOpacity: 0.1,
    starOpacity: 0.04,
    fireflyOpacity: 0,
    dustOpacity: 0.15,
    glowTint: 'rgba(255, 200, 160, 0.22)', // gentle warm lighten
  },
  {
    // Clear midday: a proper deep sky blue up top, not washed out.
    t: 0.09,
    phase: 'morning',
    sky: ['#4f8bc9', '#7fb4dd', '#c3e2df', '#eef1e2'],
    sunOpacity: 1,
    moonOpacity: 0,
    starOpacity: 0,
    fireflyOpacity: 0,
    dustOpacity: 0,
    glowTint: 'rgba(255, 255, 250, 0.05)', // near-neutral daylight
  },
  {
    // Golden hour: still blue overhead, warming fast toward the horizon.
    t: 0.34,
    phase: 'goldenHour',
    sky: ['#3d6ea0', '#d38f5e', '#eeb877', '#f8dca0'],
    sunOpacity: 0.85,
    moonOpacity: 0,
    starOpacity: 0,
    fireflyOpacity: 0.1,
    dustOpacity: 1,
    glowTint: 'rgba(255, 178, 96, 0.4)', // strong warm gold wash
  },
  {
    // Sunset: dramatic banding — indigo up top, plum, rose, amber horizon.
    t: 0.46,
    phase: 'sunset',
    sky: ['#2c2850', '#6b4570', '#c96b74', '#eb9a68'],
    sunOpacity: 0.5,
    moonOpacity: 0.25,
    starOpacity: 0.2,
    fireflyOpacity: 0.4,
    dustOpacity: 0.25,
    glowTint: 'rgba(206, 104, 128, 0.3)', // rosy dusk
  },
  {
    // Night: deep navy with a faint warm-cool gradient still visible near
    // the horizon rather than a single flat black-blue.
    t: 0.58,
    phase: 'night',
    sky: ['#080b1e', '#10162e', '#181f40', '#242a4c'],
    sunOpacity: 0,
    moonOpacity: 1,
    starOpacity: 1,
    fireflyOpacity: 1,
    dustOpacity: 0,
    glowTint: 'rgba(24, 30, 68, 0.42)', // dark navy actually dims the meadow at night
  },
  {
    // Identical to the stop above. With checkpoint-gated progression this
    // mostly exists so the final leg (sunset->night, t 0.58->1) settles
    // into a genuinely unchanging night rather than still drifting when it
    // reaches the last checkpoint and holds.
    t: 1,
    phase: 'night',
    sky: ['#080b1e', '#10162e', '#181f40', '#242a4c'],
    sunOpacity: 0,
    moonOpacity: 1,
    starOpacity: 1,
    fireflyOpacity: 1,
    dustOpacity: 0,
    glowTint: 'rgba(24, 30, 68, 0.42)', // dark navy actually dims the meadow at night
  },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpColor(a: string, b: string, t: number) {
  const pa = hexToRgb(a)
  const pb = hexToRgb(b)
  const r = Math.round(lerp(pa[0], pb[0], t))
  const g = Math.round(lerp(pa[1], pb[1], t))
  const bch = Math.round(lerp(pa[2], pb[2], t))
  return `rgb(${r}, ${g}, ${bch})`
}

function parseRgba(str: string) {
  const match = str.match(/rgba?\(([^)]+)\)/)
  const parts = (match?.[1] ?? '0,0,0,0').split(',').map((s) => parseFloat(s))
  return { r: parts[0] ?? 0, g: parts[1] ?? 0, b: parts[2] ?? 0, a: parts[3] ?? 1 }
}

function lerpRgba(a: string, b: string, t: number) {
  const pa = parseRgba(a)
  const pb = parseRgba(b)
  const r = Math.round(lerp(pa.r, pb.r, t))
  const g = Math.round(lerp(pa.g, pb.g, t))
  const bch = Math.round(lerp(pa.b, pb.b, t))
  const alpha = lerp(pa.a, pb.a, t)
  return `rgba(${r}, ${g}, ${bch}, ${alpha.toFixed(3)})`
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const bigint = parseInt(h, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

/**
 * Checkpoint-gated progression: the day only ever advances up to the
 * *current* checkpoint's ceiling and then holds there — it does not keep
 * climbing toward night on its own. Something outside the meadow (a later
 * scene finishing, a letter being read, etc.) calls advanceMeadowCheckpoint()
 * to raise the ceiling, and the day resumes climbing toward the next one.
 *
 * Ceilings line up with the phase boundaries in DAY_CYCLE_STOPS:
 *   index 0 -> 0.09  sunrise settles into morning (the free starting range —
 *                     nothing needs to call anything for this one)
 *   index 1 -> 0.34  morning -> golden hour
 *   index 2 -> 0.46  golden hour -> sunset
 *   index 3 -> 0.58  sunset -> night arrives
 *   index 4 -> 1     night arrives -> full held night (the "last note")
 *
 * Whichever module ends up owning envelope/letterOne/audio/letterTwo should
 * call advanceMeadowCheckpoint() once at its own "moving on" moment — that
 * maps naturally to checkpoints 1–4 in order. This file only defines the
 * mechanism; wiring each future scene to a call is that scene's job.
 *
 * Progress and the ceiling index are module-level (not component state) on
 * purpose: MeadowScene can unmount and remount as the user moves between
 * scenes, and the day shouldn't quietly reset to sunrise every time it does.
 */
export const DAY_CHECKPOINTS = [0.09, 0.34, 0.46, 0.58, 1]

let persistedProgress = 0
let checkpointIndex = 0
const checkpointListeners = new Set<() => void>()

export function advanceMeadowCheckpoint() {
  if (checkpointIndex < DAY_CHECKPOINTS.length - 1) {
    checkpointIndex += 1
    checkpointListeners.forEach((fn) => fn())
  }
}

/** Mostly for dev/testing — jumps straight back to the first checkpoint. */
export function resetMeadowCheckpoints() {
  checkpointIndex = 0
  persistedProgress = 0
  checkpointListeners.forEach((fn) => fn())
}

/**
 * The sun rises, arcs, and sets within its window — that's correct, it
 * should set. The moon is different: it rises once during dusk, then
 * *holds* near the top of the sky with only a slow drift for the rest of
 * the (long) night dwell, rather than re-running the same rise/set arc —
 * otherwise it dips back toward the horizon and appears to "set" right
 * before the cycle loops.
 */
const SUN_WINDOW: [number, number] = [0, 0.56]
const MOON_RISE_WINDOW: [number, number] = [0.42, 0.6]
const MOON_REST_Y = 20 // % from top — stays high in the sky, never near the horizon
const MOON_DRIFT_X: [number, number] = [30, 68] // slow horizontal wander, well clear of both edges

function sunArcPosition(progress: number) {
  const local = clamp01((progress - SUN_WINDOW[0]) / (SUN_WINDOW[1] - SUN_WINDOW[0]))
  const x = 8 + local * 74 // stays inset from the edges — reads as farther away
  const y = 66 - Math.sin(local * Math.PI) * 36 // flatter arc than before, less "in your face"
  return { x, y }
}

function moonArcPosition(progress: number) {
  if (progress <= MOON_RISE_WINDOW[1]) {
    // Rising: climbs from just above the horizon up to its resting height.
    const local = clamp01((progress - MOON_RISE_WINDOW[0]) / (MOON_RISE_WINDOW[1] - MOON_RISE_WINDOW[0]))
    const x = MOON_DRIFT_X[0] + local * 6
    const y = 78 - local * (78 - MOON_REST_Y)
    return { x, y }
  }
  // Holding: a slow, gentle drift across the night — never sets, never
  // reaches the screen edges.
  const dwellLocal = clamp01((progress - MOON_RISE_WINDOW[1]) / (1 - MOON_RISE_WINDOW[1]))
  const drift = Math.sin(dwellLocal * Math.PI) // eases out and back, no snap at the loop point
  const x = MOON_DRIFT_X[0] + 6 + drift * (MOON_DRIFT_X[1] - MOON_DRIFT_X[0] - 6)
  const y = MOON_REST_Y - drift * 3
  return { x, y }
}

export function sampleDayCycle(progress: number) {
  const p = Math.min(1, Math.max(0, progress))
  let lo = DAY_CYCLE_STOPS[0]
  let hi = DAY_CYCLE_STOPS[DAY_CYCLE_STOPS.length - 1]
  for (let i = 0; i < DAY_CYCLE_STOPS.length - 1; i++) {
    if (p >= DAY_CYCLE_STOPS[i].t && p <= DAY_CYCLE_STOPS[i + 1].t) {
      lo = DAY_CYCLE_STOPS[i]
      hi = DAY_CYCLE_STOPS[i + 1]
      break
    }
  }
  const span = hi.t - lo.t || 1
  const localT = (p - lo.t) / span

  return {
    phase: localT < 0.5 ? lo.phase : hi.phase,
    sky: lo.sky.map((color, i) => lerpColor(color, hi.sky[i], localT)),
    sunOpacity: lerp(lo.sunOpacity, hi.sunOpacity, localT),
    moonOpacity: lerp(lo.moonOpacity, hi.moonOpacity, localT),
    starOpacity: lerp(lo.starOpacity, hi.starOpacity, localT),
    fireflyOpacity: lerp(lo.fireflyOpacity, hi.fireflyOpacity, localT),
    dustOpacity: lerp(lo.dustOpacity, hi.dustOpacity, localT),
    glowTint: lerpRgba(lo.glowTint, hi.glowTint, localT),
  }
}

/**
 * Drives the meadow's lighting timeline onto CSS custom properties on `el`.
 * Single source of truth — everything else (sky, sun/moon, stars, fireflies)
 * just reads these vars, so nothing fights over "what time it is".
 */
export function startDayCycle(
  el: HTMLElement,
  durationSeconds: number,
  onPhaseChange?: (phase: DayPhase) => void,
  onProgress?: (progress: number) => void,
) {
  const state = { progress: persistedProgress }
  let lastPhase: DayPhase | null = null
  let lastWriteTime = 0
  // Sky/light values move slowly over a multi-minute cycle — 60fps precision
  // here is imperceptible but not free: every write cascades into a
  // full-viewport gradient repaint plus several other large-area repaints.
  // ~8 writes/sec is still perfectly smooth to the eye and cuts that cost by
  // roughly 85%, which matters a lot for a scene that runs continuously.
  const MIN_WRITE_INTERVAL_MS = 120

  const apply = () => {
    persistedProgress = state.progress
    const now = performance.now()
    const shouldWriteDom = now - lastWriteTime >= MIN_WRITE_INTERVAL_MS
    const sample = sampleDayCycle(state.progress)

    if (shouldWriteDom) {
      lastWriteTime = now
      sample.sky.forEach((color, i) => el.style.setProperty(`--sky-${i}`, color))
      el.style.setProperty('--sun-opacity', String(sample.sunOpacity))
      el.style.setProperty('--moon-opacity', String(sample.moonOpacity))
      el.style.setProperty('--star-opacity', String(sample.starOpacity))
      el.style.setProperty('--firefly-opacity', String(sample.fireflyOpacity))
      el.style.setProperty('--dust-opacity', String(sample.dustOpacity))
      el.style.setProperty('--glow-tint', sample.glowTint)

      // sun sets normally; moon rises once then holds (see moonArcPosition)
      const sunPos = sunArcPosition(state.progress)
      const moonPos = moonArcPosition(state.progress)
      el.style.setProperty('--sun-x', `${sunPos.x}%`)
      el.style.setProperty('--sun-y', `${sunPos.y}%`)
      el.style.setProperty('--moon-x', `${moonPos.x}%`)
      el.style.setProperty('--moon-y', `${moonPos.y}%`)
    }

    if (sample.phase !== lastPhase) {
      lastPhase = sample.phase
      onPhaseChange?.(sample.phase)
    }
    onProgress?.(state.progress)
  }

  let tween: gsap.core.Tween | null = null

  const tweenTowardCeiling = () => {
    tween?.kill()
    const target = DAY_CHECKPOINTS[checkpointIndex]
    const remaining = target - state.progress
    if (remaining <= 0) {
      // Resuming after a checkpoint advanced while unmounted, or already
      // sitting at/past this ceiling — nothing to animate, just hold.
      apply()
      return
    }
    // Proportional to how much of the whole cycle is left to cover, so the
    // pace of time passing stays consistent across checkpoint boundaries
    // instead of each leg feeling like a different speed.
    tween = gsap.to(state, {
      progress: target,
      duration: durationSeconds * remaining,
      ease: 'none',
      onUpdate: apply,
    })
  }

  const onCheckpointAdvance = () => tweenTowardCeiling()
  checkpointListeners.add(onCheckpointAdvance)

  apply()
  tweenTowardCeiling()

  return () => {
    checkpointListeners.delete(onCheckpointAdvance)
    tween?.kill()
  }
}
