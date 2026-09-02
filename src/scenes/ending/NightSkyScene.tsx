import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { ConstellationStars } from './ConstellationStars';
import { FireflyName } from './FireflyName';
import { waitingForMoonMessage, closingMessage, audioConfig } from '../../content/site';
import { letters } from '../../content/letters';
import { extraDownloads } from '../../content/downloads';
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
    buildLettersPdf().save('our-letters.pdf');

    // Any extra files configured in content/downloads.ts (e.g. a lyrics
    // PDF) download right alongside the letters. Triggered with a small
    // stagger between each — firing several downloads in the very same
    // tick is what gets multi-download browser prompts/blocks; a short
    // gap avoids that reliably.
    extraDownloads.forEach((file, index) => {
      window.setTimeout(() => downloadPublicFile(file.fileName, file.downloadName ?? file.fileName), (index + 1) * 400);
    });
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

/**
 * Downloads a file that's sitting in `public/downloads/` (see
 * `content/downloads.ts`). Some WebKit/Safari builds (iOS especially)
 * need the anchor actually in the DOM to reliably fire a download from
 * a synthetic click, so it's appended/removed rather than clicked
 * while detached.
 */
function downloadPublicFile(fileName: string, downloadAs: string) {
  const link = document.createElement('a');
  link.href = `/downloads/${fileName}`;
  link.download = downloadAs;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Builds the letters into one PDF — a simple, readable document (not
 * a visual recreation of the on-screen letter pages): each letter
 * starts on its own page, with its title as a heading, followed by
 * each page's heading (if any) and body paragraphs, word-wrapped and
 * paginated automatically as content runs long.
 */
function buildLettersPdf(): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const writeParagraph = (text: string, fontSize: number, fontStyle: 'normal' | 'bold' | 'italic', lineGap: number, after: number) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    const lineHeight = fontSize * 1.35;
    lines.forEach((line) => {
      ensureSpace(lineHeight);
      doc.text(line, margin, y);
      y += lineHeight;
    });
    y += after;
    void lineGap;
  };

  letters.forEach((letter, letterIndex) => {
    if (letterIndex > 0) {
      doc.addPage();
      y = margin;
    }

    writeParagraph(letter.title, 22, 'bold', 0, 22);

    letter.pages.forEach((page) => {
      if (page.heading) {
        writeParagraph(page.heading, 14, 'bold', 0, 8);
      }
      page.body.forEach((paragraph) => {
        writeParagraph(paragraph, 11.5, 'normal', 0, 12);
      });
      y += 6;
    });
  });

  return doc;
}

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
