import { useEffect, useState } from 'react';
import { ConstellationStars } from './ConstellationStars';
import { FireflyName } from './FireflyName';
import { waitingForMoonMessage, closingMessage, audioConfig } from '../../content/site';
import { letters } from '../../content/letters';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';
import './NightSkyScene.css';

const SILENCE_MS = 3000;
const STARS_SETTLE_ESTIMATE_MS = 10500; // matches ConstellationStars' max delay+duration
const FIREFLIES_START_DELAY_MS = STARS_SETTLE_ESTIMATE_MS + 1800; // stars finish, THEN fireflies start — sequential, not overlapping
const POST_FORMATION_PAUSE_MS = 3000; // after both have had time to settle, before the closing state appears

/**
 * The night-sky ending AND the closing state — deliberately one single
 * scene rather than two that crossfade into each other. The constellation
 * and the fireflies both need to stay exactly as they are once the closing
 * message and controls appear (nothing here should ever unmount and
 * disappear until "replay" is actually pressed), and the only way to
 * guarantee that is for there to be no scene transition between "the sky
 * is still forming" and "the sky is done" in the first place — it's all
 * the same overlay, on top of the one persistent meadow.
 *
 * The lantern itself has already fully flown by the time this scene
 * mounts (see `LetterTwoScene.tsx`). If Letter Two finishes before the
 * meadow's moon has fully settled in place, the whole sequence waits —
 * nothing forces it to arrive early.
 */
export default function NightSkyScene({ onGoTo, moonSettled }: SceneProps) {
  const [starsActive, setStarsActive] = useState(false);
  const [firefliesActive, setFirefliesActive] = useState(false);
  const [sequenceDone, setSequenceDone] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState<boolean | null>(null);

  const closingVisible = sequenceDone && Boolean(moonSettled);

  useEffect(() => {
    if (!moonSettled) return;

    const timers: number[] = [];

    timers.push(window.setTimeout(() => setStarsActive(true), SILENCE_MS));
    timers.push(window.setTimeout(() => setFirefliesActive(true), SILENCE_MS + FIREFLIES_START_DELAY_MS));

    const settleAt = SILENCE_MS + Math.max(STARS_SETTLE_ESTIMATE_MS, FIREFLIES_START_DELAY_MS + 9500);
    timers.push(window.setTimeout(() => setSequenceDone(true), settleAt + POST_FORMATION_PAUSE_MS));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [moonSettled]);

  useEffect(() => {
    let cancelled = false;
    fetch(audioConfig.src, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setAudioAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setAudioAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownloadLetters = () => {
    const text = letters
      .map((letter) => {
        const body = letter.pages
          .map((page) => [page.heading, ...page.body].filter(Boolean).join('\n\n'))
          .join('\n\n');
        return `${letter.title}\n\n${body}`;
      })
      .join('\n\n---\n\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'our-letters.txt';
    // Some WebKit/Safari builds (iOS especially, common for a link like
    // this) need the anchor actually in the DOM to reliably fire a
    // download from a synthetic click, and can drop the download
    // entirely if the blob URL is revoked before the browser's had a
    // moment to start reading it — so it's appended/removed and the
    // revoke is deferred rather than done immediately after click().
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="night-sky-scene">
      {!moonSettled && <p className="night-sky-scene__waiting">{waitingForMoonMessage}</p>}
      <ConstellationStars active={starsActive} word="I LOVE YOU" />
      <FireflyName active={firefliesActive} word="ISSU" />

      <div className={`night-sky-scene__closing ${closingVisible ? 'night-sky-scene__closing--visible' : ''}`}>
        <p className="night-sky-scene__message">{closingMessage}</p>

        <div className="night-sky-scene__controls">
          <button type="button" className="night-sky-scene__pill" onClick={() => onGoTo('loading')}>
            <MoonIcon />
            <span>{buttonLabels.replay}</span>
            <span className="night-sky-scene__sparkle" aria-hidden="true" />
          </button>

          <button type="button" className="night-sky-scene__pill" onClick={handleDownloadLetters}>
            <LetterIcon />
            <span>{buttonLabels.download}</span>
            <span className="night-sky-scene__sparkle" aria-hidden="true" />
          </button>

          {audioAvailable === false ? (
            <span
              className="night-sky-scene__pill night-sky-scene__pill--disabled"
              aria-disabled="true"
              title="add an audio file at public/audio to enable this"
            >
              <NoteIcon />
              <span>{buttonLabels.keepMyVoice}</span>
            </span>
          ) : (
            <a
              className="night-sky-scene__pill"
              href={audioConfig.src}
              download={audioConfig.downloadFileName ?? true}
              aria-label={buttonLabels.keepMyVoice}
            >
              <NoteIcon />
              <span>{buttonLabels.keepMyVoice}</span>
              <span className="night-sky-scene__sparkle" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* Small hand-drawn icons, matching the thin warm linework used throughout
   the rest of the project (see the letter pages' corner doodles) —
   standing in for generic emoji, which read as a foreign, off-the-shelf
   UI language dropped on top of an illustrated scene. */

function MoonIcon() {
  return (
    <svg className="night-sky-scene__icon" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M13.2 4.2c-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5c1 0 1.9-.2 2.8-.6-2.3-.8-3.9-3-3.9-5.6s1.6-4.8 3.9-5.6c-.9-.4-1.8-.6-2.8-.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LetterIcon() {
  return (
    <svg className="night-sky-scene__icon" viewBox="0 0 20 20" aria-hidden="true">
      <rect x="2.5" y="5" width="15" height="10.5" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 5.6 10 11 17 5.6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg className="night-sky-scene__icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="6" cy="15" r="2.3" fill="currentColor" />
      <circle cx="15" cy="13" r="2.3" fill="currentColor" />
      <path d="M8.2 15V5.8L17.2 4v9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
