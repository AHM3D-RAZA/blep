import gsap from 'gsap'

export type DayPhase =
  | 'preDawn'
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
  /** ground mist — thickest right before/at sunrise, burned off by full morning */
  mistOpacity: number
  glowTint: string // ambient light wash over the scene
}

export const SKY_STOP_COUNT = 4

export const DAY_CYCLE_STOPS: DayCycleStop[] = [
  {
    // Pre-dawn: the world hasn't woken up yet. Deep, quiet blue — really
    // dim, like the whole scene is still starting up — with just the
    // faintest hint at the horizon of what's coming. Moon and stars still
    // up but already fading, a few last fireflies about to give out.
    t: 0,
    phase: 'preDawn',
    sky: ['#050810', '#080d1f', '#0d1428', '#131a30'],
    sunOpacity: 0,
    moonOpacity: 0.35,
    starOpacity: 0.5,
    fireflyOpacity: 0.3,
    dustOpacity: 0.1,
    mistOpacity: 0.8,
    glowTint: 'rgba(4, 7, 18, 0.4)', // dark enough to actually dim everything beneath it
  },
  {
    // Dawn: cool lavender blue up top settling into blush and warm gold
    // near the horizon — a real dawn has that color band, not one flat hue.
    // Pushed well past t=0 (rather than sitting right next to pre-dawn) so
    // the dark hold actually reads as a hold, not a 3-second flash.
    t: 0.1,
    phase: 'sunrise',
    sky: ['#7c8fb5', '#b98ca3', '#e8a87e', '#f6d9a8'],
    sunOpacity: 0.8,
    moonOpacity: 0.1,
    starOpacity: 0.04,
    fireflyOpacity: 0,
    dustOpacity: 0.15,
    mistOpacity: 0.55, // still lingering, starting to burn off
    glowTint: 'rgba(255, 200, 160, 0.22)', // gentle warm lighten
  },
  {
    // Clear midday: a proper deep sky blue up top, not washed out.
    t: 0.16,
    phase: 'morning',
    sky: ['#4f8bc9', '#7fb4dd', '#c3e2df', '#eef1e2'],
    sunOpacity: 1,
    moonOpacity: 0,
    starOpacity: 0,
    fireflyOpacity: 0,
    dustOpacity: 0,
    mistOpacity: 0, // burned off by full morning
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
    mistOpacity: 0,
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
    mistOpacity: 0,
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
    mistOpacity: 0,
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
    mistOpacity: 0,
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
 * Each checkpoint is worth a section of the cycle, aligned to the meadow's
 * actual sky phases rather than being evenly spaced (wired centrally in
 * SceneManager.tsx, not by individual scenes):
 *   index 0 -> 0.1   sunrise. Climbs freely while on the start/loading
 *                     screen (no call needed — this is where the cycle
 *                     begins) — this is the compressed cinematic-sunrise
 *                     leg, see CHECKPOINT_LEG_SECONDS.
 *   index 1 -> 0.16  noon (full, clear midday light). Climbs while the
 *                     person is on the meadow + envelope — reached by
 *                     calling advanceMeadowCheckpoint() when loading hands
 *                     off to the meadow. So by the time Letter One opens,
 *                     it's noon.
 *   index 2 -> 0.46  sunset. Climbs while on the first letter — reached
 *                     when envelope hands off to letterOne. So by the time
 *                     the song starts, the sun has set.
 *   index 3 -> 0.46  still sunset — deliberately identical to index 2.
 *                     The sky holds at sunset for the whole song rather
 *                     than continuing to climb; reached when letterOne
 *                     hands off to audio.
 *   index 4 -> 1     night, finishing the cycle. Climbs during the second
 *                     letter — reached when audio hands off to letterTwo —
 *                     so the sunset -> night transition happens entirely
 *                     during Letter Two, finishing by the time it's done.
 *
 * Progress and the ceiling index are module-level (not component state) on
 * purpose: MeadowScene can unmount and remount as the user moves between
 * scenes, and the day shouldn't quietly reset to sunrise every time it does.
 */
export const DAY_CHECKPOINTS = [0.1, 0.16, 0.46, 0.46, 1]

/**
 * Per-leg duration override, indexed the same as DAY_CHECKPOINTS.
 * `undefined` means "use the normal proportional pace" (durationSeconds *
 * remaining distance). Only the opening leg is overridden: the project's
 * opening-scene spec wants the pre-dawn -> sunrise transition to read as
 * a deliberate, compressed cinematic arc (several seconds, not the ~3
 * minutes the proportional formula would give it at the default
 * durationSeconds) while every later leg keeps its natural slow pace.
 */
const CHECKPOINT_LEG_SECONDS: (number | undefined)[] = [30]

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
 * holds a single fixed position at its resting height for the rest of
 * the (long) night dwell, rather than re-running the same rise/set arc
 * or continuing to drift — once it's settled, it has genuinely, literally
 * stopped moving.
 */
const SUN_WINDOW: [number, number] = [0, 0.56]
const MOON_RISE_WINDOW: [number, number] = [0.42, 0.6]
const MOON_REST_Y = 20 // % from top — stays high in the sky, never near the horizon
const MOON_REST_X = 36 // % from left — where the moon settles and then genuinely stops
const MOON_RISE_START_X = 30 // % from left — just clear of the horizon at the start of its climb

function sunArcPosition(progress: number) {
  const local = clamp01((progress - SUN_WINDOW[0]) / (SUN_WINDOW[1] - SUN_WINDOW[0]))
  const x = 8 + local * 74 // stays inset from the edges — reads as farther away
  const arcY = 66 - Math.sin(local * Math.PI) * 36 // flatter arc than before, less "in your face"
  // Rises from below the screen rather than simply fading in already
  // mid-sky: blends from an off-screen starting point up into the normal
  // arc over the first quarter of the window, so the entrance itself
  // reads as "rising" rather than "appearing".
  const entranceLocal = clamp01(local / 0.25)
  const y = lerp(120, arcY, entranceLocal)
  return { x, y }
}

function moonArcPosition(progress: number) {
  if (progress <= MOON_RISE_WINDOW[1]) {
    // Rising: climbs from just above the horizon up to its resting height.
    const local = clamp01((progress - MOON_RISE_WINDOW[0]) / (MOON_RISE_WINDOW[1] - MOON_RISE_WINDOW[0]))
    const x = MOON_RISE_START_X + local * (MOON_REST_X - MOON_RISE_START_X)
    const y = 78 - local * (78 - MOON_REST_Y)
    return { x, y }
  }
  // Fully risen — holds a single fixed position for the rest of the
  // cycle. It used to keep gently drifting here, which meant "the moon
  // has settled" was never actually a stable, literal fact — it started
  // moving again within moments of any "settled" signal firing. Now it
  // genuinely stops.
  return { x: MOON_REST_X, y: MOON_REST_Y }
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
    mistOpacity: lerp(lo.mistOpacity, hi.mistOpacity, localT),
    glowTint: lerpRgba(lo.glowTint, hi.glowTint, localT),
  }
}

/**
 * Drives the meadow's lighting timeline onto CSS custom properties on
 * whichever elements `getElements` currently returns. Single source of
 * truth — everything else (sky, sun/moon, stars, fireflies) just reads
 * these vars, so nothing fights over "what time it is".
 *
 * `getElements` is called fresh on every tick (not just once) so an
 * element that isn't mounted yet at start time — e.g. a portal target
 * that only exists after a later render — still gets synced as soon as
 * it appears, with no need to restart the cycle.
 */
export function startDayCycle(
  getElements: () => HTMLElement[],
  durationSeconds: number,
  onPhaseChange?: (phase: DayPhase) => void,
  onProgress?: (progress: number) => void,
  onMoonSettled?: (settled: boolean) => void,
) {
  const state = { progress: persistedProgress }
  let lastPhase: DayPhase | null = null
  let lastWriteTime = 0
  // Edge-triggered against the end of MOON_RISE_WINDOW (the moon having
  // FULLY finished its climb), and re-armable so it fires again if the
  // cycle loops back around to a fresh rise. Used to hold the night-sky
  // ending's whole sequence — formation and closing controls alike —
  // back until the moon has genuinely settled in place.
  let moonSettledFired = false
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
      const els = getElements()
      const sunPos = sunArcPosition(state.progress)
      const moonPos = moonArcPosition(state.progress)
      els.forEach((el) => {
        sample.sky.forEach((color, i) => el.style.setProperty(`--sky-${i}`, color))
        el.style.setProperty('--sun-opacity', String(sample.sunOpacity))
        el.style.setProperty('--moon-opacity', String(sample.moonOpacity))
        el.style.setProperty('--star-opacity', String(sample.starOpacity))
        el.style.setProperty('--firefly-opacity', String(sample.fireflyOpacity))
        el.style.setProperty('--dust-opacity', String(sample.dustOpacity))
        el.style.setProperty('--mist-opacity', String(sample.mistOpacity))
        el.style.setProperty('--glow-tint', sample.glowTint)

        // sun sets normally; moon rises once then holds (see moonArcPosition)
        el.style.setProperty('--sun-x', `${sunPos.x}%`)
        el.style.setProperty('--sun-y', `${sunPos.y}%`)
        el.style.setProperty('--moon-x', `${moonPos.x}%`)
        el.style.setProperty('--moon-y', `${moonPos.y}%`)
      })

      // Also mirrored onto <html> — the night-sky ending's constellation/
      // firefly-name layers are siblings of the meadow (not descendants of
      // any of `els`), so they can't read those elements' own custom
      // properties directly. Same throttle, no extra cost.
      document.documentElement.style.setProperty('--star-opacity', String(sample.starOpacity))
      document.documentElement.style.setProperty('--firefly-opacity', String(sample.fireflyOpacity))
    }

    if (sample.phase !== lastPhase) {
      lastPhase = sample.phase
      onPhaseChange?.(sample.phase)
    }

    // The moon is a slow rise, not a snap to "night" — this fires once
    // it's fully finished climbing to its resting height. Re-arms once
    // the cycle loops back around (e.g. via resetMeadowCheckpoints()).
    if (!moonSettledFired && state.progress >= MOON_RISE_WINDOW[1]) {
      moonSettledFired = true
      onMoonSettled?.(true)
    } else if (moonSettledFired && state.progress < MOON_RISE_WINDOW[0]) {
      moonSettledFired = false
      onMoonSettled?.(false)
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
    // pace of time passing stays consistent across checkpoint boundaries —
    // except for legs with an explicit override (see CHECKPOINT_LEG_SECONDS),
    // which scale the same way relative to their own target so a resume
    // partway through still lands on roughly the intended total duration.
    const overrideSeconds = CHECKPOINT_LEG_SECONDS[checkpointIndex]
    const legDuration = overrideSeconds !== undefined ? overrideSeconds * (remaining / target) : durationSeconds * remaining
    tween = gsap.to(state, {
      progress: target,
      duration: legDuration,
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
