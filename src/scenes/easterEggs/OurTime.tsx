import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { relationshipStartDate, relationshipStartTimezone, timezones, ourTimeLabels, timeline } from '../../content/timeline';
import { zonedTimeToInstant, formatZonedTime, formatZonedDate, toDuration, formatDuration } from './relationshipTime';
import './OurTime.css';

const TIMEZONE_MAP: Record<string, string> = timezones;

// Computed once from static config — every render just re-diffs against
// the live clock, never against a value baked in at "page load time".
const startInstant = zonedTimeToInstant(relationshipStartDate, relationshipStartTimezone);

interface OurTimeTriggerProps {
  /**
   * Same portal target the meadow's memory bubbles/butterflies/petals/
   * fireflies use (see MeadowScene.tsx) — mounted once on the
   * persistent meadow so the trigger stays put and tappable on every
   * scene, not just Letter One.
   */
  atmosphereLayer: HTMLElement | null;
  /**
   * False for the whole loading screen — the clock stays hidden and
   * untappable so it doesn't distract from or compete with that opening
   * moment. True permanently from the first time the meadow scene is
   * actually reached onward (see easterEggsRevealed in MeadowScene.tsx).
   */
  revealed: boolean;
}

/**
 * A small clock that lives in the corner of the screen throughout the
 * whole experience — not hidden away, but not shouting either: a slow
 * breathing pulse and an occasional soft ring are enough to catch her
 * eye if she lingers on a scene, without it ever demanding attention.
 * Tapping it opens the "Our Time" overlay.
 */
export function OurTimeTrigger({ atmosphereLayer, revealed }: OurTimeTriggerProps) {
  const [open, setOpen] = useState(false);

  if (!atmosphereLayer) return null;

  return createPortal(
    <>
      <button
        type="button"
        className={`our-time-trigger${revealed ? ' is-revealed' : ''}`}
        aria-label={ourTimeLabels.title}
        onClick={revealed ? () => setOpen(true) : undefined}
        aria-hidden={!revealed}
        tabIndex={revealed ? 0 : -1}
      >
        <span className="our-time-trigger__ping" aria-hidden="true" />
        <ClockDoodle />
      </button>
      {open && <OurTimeOverlay onClose={() => setOpen(false)} />}
    </>,
    atmosphereLayer,
  );
}

function OurTimeOverlay({ onClose }: { onClose: () => void }) {
  const [now, setNow] = useState(() => new Date());

  // Ticks the live clocks + duration counter every second while open;
  // stops the moment the overlay closes/unmounts.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const hereZone = TIMEZONE_MAP[ourTimeLabels.hereTimezoneKey];
  const thereZone = TIMEZONE_MAP[ourTimeLabels.thereTimezoneKey];
  const duration = toDuration(now.getTime() - startInstant.getTime());

  return (
    <div className="our-time-overlay" role="dialog" aria-label={ourTimeLabels.title} onClick={onClose}>
      <div className="our-time-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="our-time-card__close" aria-label="close" onClick={onClose}>
          ×
        </button>

        <p className="our-time-card__title">{ourTimeLabels.title}</p>

        <div className="our-time-card__zones">
          <div className="our-time-card__zone">
            <span className="our-time-card__zone-label">{ourTimeLabels.hereLabel}</span>
            <span className="our-time-card__zone-clock">{hereZone ? formatZonedTime(now, hereZone) : '--:--'}</span>
            <span className="our-time-card__zone-place">
              {ourTimeLabels.hereName}
              {hereZone ? ` · ${formatZonedDate(now, hereZone)}` : ''}
            </span>
          </div>

          <div className="our-time-card__divider" aria-hidden="true" />

          <div className="our-time-card__zone">
            <span className="our-time-card__zone-label">{ourTimeLabels.thereLabel}</span>
            <span className="our-time-card__zone-clock">{thereZone ? formatZonedTime(now, thereZone) : '--:--'}</span>
            <span className="our-time-card__zone-place">
              {ourTimeLabels.thereName}
              {thereZone ? ` · ${formatZonedDate(now, thereZone)}` : ''}
            </span>
          </div>
        </div>

        <ol className="our-time-card__timeline"></ol>

        <p className="our-time-card__duration-intro">{ourTimeLabels.durationIntro}</p>
        <p className="our-time-card__duration">{formatDuration(duration)}</p>
      
      <OurTimeline />
      
      </div>
    </div>
  );
}

/**
 * The vertical row of relationship milestones — reads straight from
 * `timeline` in `content/timeline.ts`, in order. Add/edit/remove
 * milestones there; this never needs to change for that.
 */
function OurTimeline() {
  if (timeline.length === 0) return null;

  return (
    <ol className="our-time-card__timeline">
      {timeline.map((entry) => (
        <li key={entry.id} className="our-time-card__timeline-item">
          <span className="our-time-card__timeline-dot" aria-hidden="true" />
          <div className="our-time-card__timeline-body">
            <p className="our-time-card__timeline-title">{entry.title}</p>
            {entry.pending ? (
              <p className="our-time-card__timeline-when our-time-card__timeline-when--pending">
                date &amp; time coming soon
              </p>
            ) : (
              <p className="our-time-card__timeline-when">
                {entry.dateLabel}
                {entry.timeLabel ? ` · ${entry.timeLabel}` : ''}
              </p>
            )}
            {entry.description && <p className="our-time-card__timeline-desc">{entry.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function ClockDoodle() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className="our-time-trigger__svg">
      <circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 12v8l6 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}
