import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { startDayCycle } from './dayCycle'
import { generateStars } from './sky'
import { CLOUDS } from './clouds'
import { GRASS_LAYERS, bladePath } from './grass'
import { generateDaisies } from './daisies'
import { generateSunflowers } from './sunflowers'
import { generateButterflies } from './butterflies'
import { generatePetals } from './petals'
import { generateFireflies } from './fireflies'
import { generateDust } from './dust'
import { startWind } from './wind'
import { startCameraDrift } from './camera'
import type { SceneProps } from '../sceneTypes'
import './MeadowScene.css'

// Full day cycle length. Long enough to feel like a real day passing rather
// than a visible loop, short enough that golden hour/night are actually seen.
const DAY_CYCLE_SECONDS = 220

const stars = generateStars(90)
const daisies = generateDaisies(24)
const sunflowers = generateSunflowers(6)
const butterflies = generateButterflies(9)
const petals = generatePetals(6)
const fireflies = generateFireflies(16)
const dust = generateDust(20)

export default function MeadowScene({ onNext }: SceneProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const butterflyRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [showContinue, setShowContinue] = useState(false)

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

    const stopDayCycle = startDayCycle(
      root,
      DAY_CYCLE_SECONDS,
      undefined,
      (progress) => {
        // Reveal butterflies gradually as the day goes on, per the bible's
        // "start sparse, increase gradually" rule.
        for (const b of butterflies) {
          const node = butterflyRefs.current[b.id]
          if (!node) continue
          const shouldShow = progress >= b.appearsAfter
          node.style.opacity = shouldShow ? '1' : '0'
        }
      },
    )
    const stopWind = startWind(root)
    const stopCamera = startCameraDrift(world)

    // Per-butterfly wander + occasional landing near a daisy.
    const butterflyTweens: gsap.core.Timeline[] = []
    butterflies.forEach((b, i) => {
      const node = butterflyRefs.current[b.id]
      if (!node) return
      const nearbyDaisy = daisies[(i * 3) % daisies.length]
      const tl = gsap.timeline({ repeat: -1, delay: b.delay })

      const wander = () => {
        tl.to(node, {
          left: `${Math.min(96, Math.max(2, b.startX + (Math.random() - 0.5) * b.driftX * 2))}%`,
          top: `${Math.min(70, Math.max(15, b.startY + (Math.random() - 0.5) * b.driftY * 2))}%`,
          duration: b.duration * 0.5,
          ease: 'sine.inOut',
        })
      }

      wander()
      wander()
      // Land on a daisy, fold wings briefly, then take off again.
      tl.to(node, {
        left: `${nearbyDaisy.x}%`,
        top: `${94 - nearbyDaisy.y}%`,
        duration: b.duration * 0.4,
        ease: 'power1.inOut',
      })
        .to(node, { duration: 1.8 }) // pause, "landed"
        .call(() => node.classList.add('is-landed'))
        .to({}, { duration: 1.6 })
        .call(() => node.classList.remove('is-landed'))
      wander()

      butterflyTweens.push(tl)
    })

    return () => {
      stopDayCycle()
      stopWind()
      stopCamera()
      butterflyTweens.forEach((tl) => tl.kill())
    }
  }, [])

  return (
    <div ref={rootRef} className="meadow-root">
      <div ref={worldRef} className="meadow-world">
        {/* Sky */}
        <div className="meadow-sky" />
        <div className="meadow-glow" />

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
                  animationDelay: `${s.twinkleDelay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Sun */}
        <div className="celestial sun" />
        {/* Moon */}
        <div className="celestial moon">
          <svg viewBox="0 0 100 100" className="moon-craters" aria-hidden="true">
            <circle cx="35" cy="30" r="8" />
            <circle cx="60" cy="55" r="10" />
            <circle cx="42" cy="70" r="6" />
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

        {/* Golden hour dust */}
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

        {/* Sunflowers (behind grass front layer, in front of back layers) */}
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
                      fill="#f4c430"
                      transform={`rotate(${i * 30})`}
                    />
                  ))}
                  <circle r="9" fill="#6b4423" />
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
                      fill="#fffdf6"
                      transform={`rotate(${i * 45})`}
                    />
                  ))}
                  <circle r="4.5" fill="#f4c430" />
                </g>
              </svg>
            </div>
          ))}
        </div>

        {/* Grass layers, back to front */}
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
                const x = (i / layer.bladeCount) * 100
                const lean = ((i % 5) - 2) * 1.2
                return (
                  <g
                    key={i}
                    className="blade"
                    style={
                      {
                        transformOrigin: `${x + 1.5}px 20px`,
                        '--dur': `${layer.swaySpeed + (i % 4) * 0.3}s`,
                        '--delay': `${(i % 6) * 0.2}s`,
                      } as React.CSSProperties
                    }
                  >
                    <path d={bladePath(3, 20, lean)} fill={layer.hue} transform={`translate(${x}, 0)`} />
                  </g>
                )
              })}
            </svg>
          </div>
        ))}

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
