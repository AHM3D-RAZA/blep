import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { startDayCycle, sampleDayCycle } from './dayCycle'
import { generateStars } from './sky'
import { CLOUDS } from './clouds'
import { GRASS_LAYERS, bladePath } from './grass'
import { HILLS, HILL_DAISIES } from './hills'
import { generateDaisies } from './daisies'
import { generateSunflowers } from './sunflowers'
import { generateWildflowers } from './wildflowers'
import { generateButterflies } from './butterflies'
import { generatePetals } from './petals'
import { generateFireflies } from './fireflies'
import { generateDust } from './dust'
import { startWind } from './wind'
import { startCameraDrift } from './camera'
import type { SceneProps } from '../sceneTypes'
import './MeadowScene.css'

// Full day cycle length, in seconds — the only number you need to touch to
// make the day pass faster or slower. Night holds for roughly the last 40%
// of this (see the two identical stops at the end of DAY_CYCLE_STOPS in
// dayCycle.ts), so a 540s cycle means ~5.5min of day + ~3.5min of held night.
const DAY_CYCLE_SECONDS = 540

const stars = generateStars(110)
const daisies = generateDaisies(42)
const sunflowers = generateSunflowers()
const butterflies = generateButterflies(9)
const petals = generatePetals(6)
const fireflies = generateFireflies(14)
const dust = generateDust(20)
const wildflowers = generateWildflowers(16)

export default function MeadowScene({ onNext }: SceneProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const butterflyRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [showContinue, setShowContinue] = useState(false)
  const [showDust, setShowDust] = useState(false)

  useEffect(() => {
    // Let the meadow breathe before offering a way forward — this is the
    // opening world, not a form to rush through.
    const id = window.setTimeout(() => setShowContinue(true), 6000)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const world = worldRef.current
    if (!root || !world) return
    const butterflyNodes = butterflyRefs.current

    const butterflyShown: Record<string, boolean> = {}
    let dustShown = false
    const stopDayCycle = startDayCycle(
      root,
      DAY_CYCLE_SECONDS,
      undefined,
      (progress) => {
        // Reveal butterflies gradually as the day goes on, per the bible's
        // "start sparse, increase gradually" rule. Only touch the DOM when a
        // butterfly's shown/hidden state actually changes — this callback
        // fires every frame for the whole scene's lifetime, so writing
        // style.opacity unconditionally here was ~9 wasted writes/frame,
        // forever, for a value that only actually changes 9 times total.
        for (const b of butterflies) {
          const shouldShow = progress >= b.appearsAfter
          if (butterflyShown[b.id] === shouldShow) continue
          butterflyShown[b.id] = shouldShow
          const node = butterflyNodes[b.id]
          if (node) node.style.opacity = shouldShow ? '1' : '0'
        }

        // Golden-hour dust is only relevant for a small slice of the cycle
        // (~15% of it) — unmount it the rest of the time instead of leaving
        // 20 particles animating at opacity 0 for minutes on end.
        const dustActive = sampleDayCycle(progress).dustOpacity > 0.01
        if (dustActive !== dustShown) {
          dustShown = dustActive
          setShowDust(dustActive)
        }
      },
    )
    const stopWind = startWind(root)
    const stopCamera = startCameraDrift(world)

    // Per-butterfly wander + occasional landing near a daisy. Each leg picks
    // a fresh random destination *when it completes*, rather than baking
    // fixed random targets into a repeat:-1 timeline (which just replayed
    // the same "random" path forever — that was the back-and-forth bug).
    const butterflyStates: { cancelled: boolean }[] = []
    butterflies.forEach((b) => {
      const node = butterflyNodes[b.id]
      if (!node) return
      const state = { cancelled: false }
      butterflyStates.push(state)

      const scheduleNext = () => {
        if (state.cancelled) return

        const willLand = Math.random() < 0.16
        if (willLand) {
          const daisy = daisies[Math.floor(Math.random() * daisies.length)]
          gsap
            .timeline({ onComplete: scheduleNext })
            .to(node, {
              left: `${daisy.x}%`,
              top: `${94 - daisy.y}%`,
              duration: b.duration * 0.4 + Math.random() * 0.4,
              ease: 'power1.inOut',
            })
            .call(() => node.classList.add('is-landed'))
            .to({}, { duration: 1.4 + Math.random() * 1.6 })
            .call(() => node.classList.remove('is-landed'))
        } else {
          const targetX = Math.min(96, Math.max(2, b.startX + (Math.random() - 0.5) * b.driftX * 2.4))
          const targetY = Math.min(70, Math.max(15, b.startY + (Math.random() - 0.5) * b.driftY * 2.4))
          gsap.to(node, {
            left: `${targetX}%`,
            top: `${targetY}%`,
            duration: b.duration * 0.35 + Math.random() * b.duration * 0.35,
            ease: 'sine.inOut',
            onComplete: scheduleNext,
          })
        }
      }

      gsap.delayedCall(b.delay, scheduleNext)
    })

    return () => {
      stopDayCycle()
      stopWind()
      stopCamera()
      butterflyStates.forEach((state) => {
        state.cancelled = true
      })
      butterflies.forEach((b) => {
        const node = butterflyNodes[b.id]
        if (node) gsap.killTweensOf(node)
      })
    }
  }, [])

  return (
    <div ref={rootRef} className="meadow-root">
      <div ref={worldRef} className="meadow-world">
        {/* Sky */}
        <div className="meadow-sky" />

        {/* Stars */}
        <div className="meadow-stars">
          {stars.map((s) => (
            <div
              key={`${s.x}-${s.y}`}
              className="star"
              style={
                {
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  '--star-size': s.size,
                  animationDelay: `${s.twinkleDelay}s`,
                  animationDuration: `${s.twinkleDuration}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Sun */}
        <div className="celestial sun" />
        {/* Moon */}
        <div className="celestial moon">
          <svg viewBox="0 0 100 100" className="moon-svg" aria-hidden="true">
            <defs>
              <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff6d7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fff6d7" stopOpacity="0" />
              </radialGradient>
              <mask id="moonCrescent">
                <rect x="0" y="0" width="100" height="100" fill="white" />
                <circle cx="64" cy="35" r="30" fill="black" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#moonGlow)" />
            <g mask="url(#moonCrescent)">
              <circle cx="46" cy="46" r="27" fill="#f4efd8" />
              <circle cx="36" cy="33" r="4.5" fill="#d8d0b3" opacity="0.5" />
              <circle cx="55" cy="53" r="6" fill="#d8d0b3" opacity="0.45" />
              <circle cx="39" cy="58" r="3" fill="#d8d0b3" opacity="0.4" />
            </g>
          </svg>
        </div>

        {/* Clouds */}
        <div className="meadow-clouds">
          {CLOUDS.map((c) => (
            <div
              key={c.id}
              className="cloud"
              style={
                {
                  top: `${c.top}%`,
                  '--cloud-scale': c.scale,
                  '--cloud-duration': `${c.duration}s`,
                  '--cloud-delay': `${c.delay}s`,
                  opacity: c.opacity,
                } as React.CSSProperties
              }
            >
              <svg viewBox="0 0 200 80" aria-hidden="true">
                <ellipse cx="50" cy="50" rx="45" ry="28" />
                <ellipse cx="95" cy="35" rx="55" ry="35" />
                <ellipse cx="150" cy="48" rx="42" ry="26" />
              </svg>
            </div>
          ))}
        </div>

        {/* Golden hour dust — only mounted while actually relevant (see
            showDust in the effect above), not animated all cycle long. */}
        {showDust && (
          <div className="meadow-dust">
            {dust.map((d) => (
              <div
                key={d.id}
                className="dust-mote"
                style={
                  {
                    left: `${d.x}%`,
                    top: `${d.y}%`,
                    '--dust-duration': `${d.duration}s`,
                    '--dust-delay': `${d.delay}s`,
                    '--dust-drift': `${d.drift}px`,
                    '--dust-scale': d.scale,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}

        {/* Fireflies */}
        <div className="meadow-fireflies">
          {fireflies.map((f) => (
            <div
              key={f.id}
              className="firefly"
              style={
                {
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  '--fly-duration': `${f.duration}s`,
                  '--fly-delay': `${f.delay}s`,
                  '--fly-dx': `${f.driftX}px`,
                  '--fly-dy': `${f.driftY}px`,
                  '--pulse-duration': `${f.pulseDuration}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Petals */}
        <div className="meadow-petals">
          {petals.map((p) => (
            <div
              key={p.id}
              className="petal"
              style={
                {
                  left: `${p.startX}%`,
                  '--petal-duration': `${p.duration}s`,
                  '--petal-delay': `${p.delay}s`,
                  '--petal-drift': `${p.drift}px`,
                  '--petal-scale': p.scale,
                  '--petal-rot': p.rotations,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Hills — back hill peeks up behind the front one for depth */}
        <div className="meadow-hills">
          {HILLS.map((hill) => (
            <div
              key={hill.id}
              className="hill"
              style={
                {
                  height: `${hill.heightVh}vh`,
                  bottom: `${hill.bottomVh}vh`,
                  opacity: hill.opacity,
                } as React.CSSProperties
              }
            >
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="hill-svg">
                <path d={hill.path} fill={hill.fill} />
              </svg>
              <div className="hill-daisies">
                {(HILL_DAISIES[hill.id] ?? []).map((d, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 30 70"
                    className="hill-daisy"
                    style={
                      {
                        left: `${d.x}%`,
                        bottom: `${d.y}%`,
                        '--flower-scale': d.scale,
                      } as React.CSSProperties
                    }
                    aria-hidden="true"
                  >
                    <g transform="translate(15 16)">
                      {Array.from({ length: 6 }).map((_, p) => (
                        <ellipse key={p} cx="0" cy="-6" rx="2" ry="5" fill="#f6f1e2" transform={`rotate(${p * 60})`} />
                      ))}
                      <circle r="3.2" fill="#e6b23f" />
                    </g>
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Grass layers, back to front — rendered before flowers so it sits
            behind them instead of covering the blossoms. */}
        {GRASS_LAYERS.map((layer, li) => (
          <div
            key={layer.id}
            className="grass-layer"
            style={
              {
                bottom: `${layer.bottom}%`,
                height: `${layer.height}vh`,
                opacity: layer.opacity,
                '--sway-amp': li === GRASS_LAYERS.length - 1 ? 1 : 0.6,
              } as React.CSSProperties
            }
          >
            <svg viewBox={`0 0 100 20`} preserveAspectRatio="none" className="grass-svg">
              {Array.from({ length: layer.bladeCount }).map((_, i) => {
                const jitter = ((i * 37) % 11) / 11 - 0.5 // deterministic pseudo-random offset, -0.5..0.5
                const x = (i / layer.bladeCount) * 100 + jitter * 1.4
                const lean = ((i % 5) - 2) * 0.9
                const bladeHeight = 17 + ((i * 13) % 7) // 17–23, small natural variance
                const bladeWidth = 1.6 + ((i % 3) * 0.3) // 1.6–2.2, thin
                return (
                  <g
                    key={i}
                    className="blade"
                    style={
                      {
                        transformOrigin: `${x + bladeWidth / 2}px 20px`,
                        '--dur': `${layer.swaySpeed + (i % 4) * 0.3}s`,
                        '--delay': `${(i % 6) * 0.2}s`,
                      } as React.CSSProperties
                    }
                  >
                    <path
                      d={bladePath(bladeWidth, bladeHeight, lean)}
                      fill={layer.hue}
                      transform={`translate(${x}, ${20 - bladeHeight})`}
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        ))}

        {/* Sunflowers — on top of grass so they're actually visible */}
        <div className="meadow-sunflowers">
          {sunflowers.map((f) => (
            <div
              key={f.id}
              className="sunflower"
              style={
                {
                  left: `${f.x}%`,
                  bottom: `${f.y}%`,
                  '--flower-scale': f.scale,
                  '--sway-delay': `${f.swayDelay}s`,
                } as React.CSSProperties
              }
            >
              <svg viewBox="0 0 40 100" className="sunflower-svg" aria-hidden="true">
                <line x1="20" y1="40" x2="20" y2="100" stroke="#3f6b2f" strokeWidth="3" />
                <path d="M20 40 Q8 46 10 58" stroke="#3f6b2f" strokeWidth="2.5" fill="none" />
                <g transform="translate(20 26)">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-14"
                      rx="4.5"
                      ry="10"
                      fill="#e6b23f"
                      transform={`rotate(${i * 30})`}
                    />
                  ))}
                  <circle r="9" fill="#7a4d2c" />
                </g>
              </svg>
            </div>
          ))}
        </div>

        {/* Daisies — always present, in every phase */}
        <div className="meadow-daisies">
          {daisies.map((d) => (
            <div
              key={d.id}
              className="daisy"
              style={
                {
                  left: `${d.x}%`,
                  bottom: `${d.y}%`,
                  '--flower-scale': d.scale,
                  '--sway-delay': `${d.swayDelay}s`,
                } as React.CSSProperties
              }
            >
              <svg viewBox="0 0 30 70" className="daisy-svg" aria-hidden="true">
                <line x1="15" y1="26" x2="15" y2="70" stroke="#4a7c3f" strokeWidth="2" />
                <g transform="translate(15 16)">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-8"
                      rx="2.6"
                      ry="7"
                      fill="#f6f1e2"
                      transform={`rotate(${i * 45})`}
                    />
                  ))}
                  <circle r="4.5" fill="#e6b23f" />
                </g>
              </svg>
            </div>
          ))}
        </div>

        {/* Wildflowers — small mixed-color accents through the foreground field */}
        <div className="meadow-wildflowers">
          {wildflowers.map((w) => (
            <div
              key={w.id}
              className="wildflower"
              style={
                {
                  left: `${w.x}%`,
                  bottom: `${w.y}%`,
                  '--flower-scale': w.scale,
                  '--sway-delay': `${w.swayDelay}s`,
                  '--wildflower-hue': w.hue,
                } as React.CSSProperties
              }
            >
              <svg viewBox="0 0 20 46" className="wildflower-svg" aria-hidden="true">
                <line x1="10" y1="18" x2="10" y2="46" stroke="#4a7c3f" strokeWidth="1.6" />
                <g transform="translate(10 10)">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ellipse key={i} cx="0" cy="-5" rx="2" ry="4.4" fill="var(--wildflower-hue)" transform={`rotate(${i * 72})`} />
                  ))}
                  <circle r="2.4" fill="#f6e3a8" />
                </g>
              </svg>
            </div>
          ))}
        </div>

        {/* Butterflies */}
        <div className="meadow-butterflies">
          {butterflies.map((b) => (
            <div
              key={b.id}
              ref={(node) => {
                butterflyRefs.current[b.id] = node
              }}
              className="butterfly"
              style={
                {
                  left: `${b.startX}%`,
                  top: `${b.startY}%`,
                  opacity: 0,
                  '--wing-hue': b.hue,
                } as React.CSSProperties
              }
            >
              <svg viewBox="0 0 30 20" className="butterfly-svg" aria-hidden="true">
                <g className="wing wing-left">
                  <ellipse cx="8" cy="8" rx="7" ry="6" />
                </g>
                <g className="wing wing-right">
                  <ellipse cx="22" cy="8" rx="7" ry="6" />
                </g>
                <line x1="15" y1="4" x2="15" y2="16" stroke="#2b2b2b" strokeWidth="1.4" />
              </svg>
            </div>
          ))}
        </div>

        {/* Ambient time-of-day tint — deliberately last so it washes over
            every object (flowers, grass, hills, butterflies), not just the
            sky behind them. */}
        <div className="meadow-glow" />
      </div>

      {onNext && (
        <button
          type="button"
          className={`meadow-continue${showContinue ? ' is-visible' : ''}`}
          onClick={onNext}
        >
          step into the meadow
        </button>
      )}
    </div>
  )
}
