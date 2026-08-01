import { useCallback, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { buttonLabels } from '../../content/buttons';
import type { AudioConfig } from '../../types/content';
import type { AudioPlayerControls } from './audioControls';
import { formatTime } from './audioControls';
import './CDPlayer.css';

interface CDPlayerProps {
  audio: AudioConfig;
  player: AudioPlayerControls;
}

/**
 * The handcrafted "record player" the audio scene is built around — a
 * small travel gramophone case, not a media widget. No
 * `<audio controls>` anywhere; every affordance here is custom-drawn.
 * Deliberately compact (one self-contained card) so the whole scene
 * fits on screen without scrolling.
 */
export function CDPlayer({ audio, player }: CDPlayerProps) {
  const {
    audioRef,
    isPlaying,
    hasEnded,
    progress,
    currentTime,
    duration,
    isLoading,
    hasError,
    isScratching,
    toggle,
    replay,
    seekTo,
    scratch,
  } = player;

  const ribbonRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const ribbon = ribbonRef.current;
      if (!ribbon) return;
      const rect = ribbon.getBoundingClientRect();
      const fraction = (clientX - rect.left) / rect.width;
      seekTo(fraction);
    },
    [seekTo],
  );

  const handleRibbonPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    updateFromPointer(event.clientX);
  };
  const handleRibbonPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromPointer(event.clientX);
  };
  const handleRibbonPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);
  };

  const handleVinylPointerDown = () => {
    // A little playful scratch when you nudge the record while it plays —
    // tasteful and momentary, never disruptive to the recording itself.
    scratch();
  };

  return (
    <div className={`cd-player${isPlaying ? ' is-playing' : ''}${hasEnded ? ' has-ended' : ''}`}>
      <audio ref={audioRef} src={audio.src} preload="metadata" />

      <div className="cd-player__handle" aria-hidden="true" />

      <div className="cd-player__case">
        <span className="cd-player__rivet cd-player__rivet--tl" aria-hidden="true" />
        <span className="cd-player__rivet cd-player__rivet--tr" aria-hidden="true" />
        <span className="cd-player__rivet cd-player__rivet--bl" aria-hidden="true" />
        <span className="cd-player__rivet cd-player__rivet--br" aria-hidden="true" />

        <div className="cd-player__header">
          <span className="cd-player__stamp" aria-hidden="true">
            <MusicNoteIcon />
          </span>
          <div className="cd-player__titles">
            <p className="cd-player__title">{audio.title}</p>
            {audio.subtitle && <p className="cd-player__subtitle">{audio.subtitle}</p>}
          </div>
        </div>

        <div className="cd-player__deck">
          <div className="cd-player__doily" aria-hidden="true" />

          <button
            type="button"
            className={`cd-player__vinyl${isScratching ? ' is-scratching' : ''}`}
            onPointerDown={handleVinylPointerDown}
            onClick={toggle}
            aria-label={isPlaying ? buttonLabels.pause : buttonLabels.play}
          >
            <span className="cd-player__grooves" aria-hidden="true" />
            <span className="cd-player__sheen" aria-hidden="true" />
            <span className="cd-player__label">
              <span className="cd-player__label-ring" aria-hidden="true" />
            </span>
          </button>

          <div className="cd-player__tonearm" aria-hidden="true">
            <div className="cd-player__tonearm-base" />
            <div className="cd-player__tonearm-arm" />
            <div className="cd-player__tonearm-head" />
          </div>
        </div>

        <div
          ref={ribbonRef}
          className="cd-player__ribbon"
          onPointerDown={handleRibbonPointerDown}
          onPointerMove={handleRibbonPointerMove}
          onPointerUp={handleRibbonPointerUp}
          role="slider"
          aria-label="playback position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={0}
        >
          <div className="cd-player__ribbon-track">
            <div className="cd-player__ribbon-fill" style={{ width: `${Math.min(progress, 1) * 100}%` }} />
            <div className="cd-player__ribbon-marker" style={{ left: `${Math.min(progress, 1) * 100}%` }}>
              <span aria-hidden="true">✿</span>
            </div>
          </div>
          <div className="cd-player__time">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>

        <div className="cd-player__controls">
          <button
            type="button"
            className="cd-player__button cd-player__button--replay"
            onClick={replay}
            aria-label={buttonLabels.replay}
          >
            <ReplayIcon />
          </button>

          <button
            type="button"
            className="cd-player__button cd-player__button--play"
            onClick={toggle}
            aria-label={isPlaying ? buttonLabels.pause : buttonLabels.play}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <a
            className="cd-player__button cd-player__button--download"
            href={audio.src}
            download={audio.downloadFileName ?? true}
            aria-label={buttonLabels.download}
          >
            <DownloadIcon />
          </a>
        </div>

        {isLoading && !hasError && <p className="cd-player__status">warming up the needle…</p>}
        {hasError && (
          <p className="cd-player__status cd-player__status--error">
            not found at <code>{audio.src}</code> — check the file, then tap play again.
          </p>
        )}
        {hasEnded && !hasError && !isLoading && <p className="cd-player__status">that was for you 🤍</p>}
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M6 4.5v15l13-7.5z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <rect x="5.5" y="4.5" width="4.5" height="15" rx="1.2" fill="currentColor" />
      <rect x="14" y="4.5" width="4.5" height="15" rx="1.2" fill="currentColor" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M12 5V2L7.5 6 12 10V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"
        fill="currentColor"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <path
        d="M12 3v11.2m0 0 4.2-4.2M12 14.2 7.8 10M5 18h14v3H5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MusicNoteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <path
        d="M9 18a3 3 0 1 1-2-2.83V4.8a1 1 0 0 1 1.2-.98l9 1.8A1 1 0 0 1 18 6.6V16a3 3 0 1 1-2-2.83V7.4l-7-1.4v9.17c.63.24 1 .74 1 1.4v.02Z"
        fill="currentColor"
      />
    </svg>
  );
}
