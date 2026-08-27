import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { memories } from '../../content/memories'
import { spawnBubble, randomDelay, createMemoryPicker, FIRST_DELAY_RANGE, INTERVAL_RANGE, type BubbleSpawn } from './memoryBubbleSpawns'
import type { MemoryEntry } from '../../types/content'
import './MemoryBubbles.css'

const NOTE_VISIBLE_MS = 3800
const POP_ANIMATION_MS = 220

interface MemoryBubblesProps {
  /**
   * Same portal target the persistent meadow's own butterflies/petals/
   * fireflies use (see MeadowScene.tsx) — keeps bubbles drifting above
   * whichever scene overlay currently happens to be showing, without
   * this component needing its own separate mount point in the DOM.
   */
  atmosphereLayer: HTMLElement | null
}

interface RevealedMemory {
  entry: MemoryEntry
  /** Position in pixels, relative to atmosphereLayer — exactly where the bubble was popped. */
  x: number
  y: number
}

/**
 * Rare bubbles that occasionally drift slowly up out of the meadow, in
 * every scene. Tapping one pops it and reveals a single memory — just
 * plain floating text, right where the bubble was, like a small passing
 * thought — pulled from `content/memories.ts`. Purely additive: doesn't
 * touch the meadow's existing petal/firefly/butterfly systems, and
 * cleans up its own timers on unmount.
 */
export function MemoryBubbles({ atmosphereLayer }: MemoryBubblesProps) {
  const [bubble, setBubble] = useState<(BubbleSpawn & { popped: boolean }) | null>(null)
  const [note, setNote] = useState<RevealedMemory | null>(null)
  const pickerRef = useRef(createMemoryPicker(memories))
  const timersRef = useRef<number[]>([])

  const track = (id: number) => {
    timersRef.current.push(id)
    return id
  }

  useEffect(() => {
    let cancelled = false

    // A bubble spawns, drifts for its own lifetime, then either dissolves
    // (if never tapped) or is dismissed early by handlePop — either way,
    // the next spawn is scheduled once its lifetime elapses, keeping the
    // cadence steady regardless of whether it was popped.
    const cycle = (range: [number, number]) => {
      track(
        window.setTimeout(() => {
          if (cancelled) return
          const spawned = spawnBubble()
          setBubble({ ...spawned, popped: false })
          track(
            window.setTimeout(() => {
              if (cancelled) return
              setBubble((current) => (current?.id === spawned.id ? null : current))
              cycle(INTERVAL_RANGE)
            }, spawned.duration * 1000),
          )
        }, randomDelay(range) * 1000),
      )
    }

    cycle(FIRST_DELAY_RANGE)

    return () => {
      cancelled = true
      timersRef.current.forEach((t) => window.clearTimeout(t))
      timersRef.current = []
    }
  }, [])

  if (!atmosphereLayer) return null

  const handlePop = (buttonEl: HTMLButtonElement) => {
    // Measure exactly where the bubble was tapped, relative to the
    // atmosphere layer itself (its portal container), so the revealed
    // text can appear in that same spot rather than a fixed screen
    // position. Clamped a little inward so the text never lands
    // clipped against an edge or under the bottom safe-area controls.
    const bubbleRect = buttonEl.getBoundingClientRect()
    const containerRect = atmosphereLayer.getBoundingClientRect()
    const rawX = bubbleRect.left + bubbleRect.width / 2 - containerRect.left
    const rawY = bubbleRect.top + bubbleRect.height / 2 - containerRect.top
    const x = Math.min(Math.max(rawX, 56), containerRect.width - 56)
    const y = Math.min(Math.max(rawY, 40), containerRect.height - 84)

    setBubble((current) => {
      if (!current || current.popped) return current
      const entry = pickerRef.current()
      track(
        window.setTimeout(() => {
          setBubble(null)
          if (!entry) return
          setNote({ entry, x, y })
          track(window.setTimeout(() => setNote(null), NOTE_VISIBLE_MS))
        }, POP_ANIMATION_MS),
      )
      return { ...current, popped: true }
    })
  }

  return createPortal(
    <>
      {bubble && (
        <div
          className="memory-bubble-wrap"
          style={
            {
              left: `${bubble.x}%`,
              '--bubble-duration': `${bubble.duration}s`,
              '--bubble-drift': `${bubble.drift}vmin`,
              animationPlayState: bubble.popped ? 'paused' : 'running',
            } as React.CSSProperties
          }
        >
          <button
            type="button"
            aria-label="a small memory, drifting by"
            className={`memory-bubble${bubble.popped ? ' is-popped' : ''}`}
            onClick={(event) => handlePop(event.currentTarget)}
          />
        </div>
      )}

      {note && (
        <p
          key={note.entry.id}
          className="memory-note"
          style={{ left: `${note.x}px`, top: `${note.y}px` }}
          onClick={() => setNote(null)}
        >
          {note.entry.title}
        </p>
      )}
    </>,
    atmosphereLayer,
  )
}
