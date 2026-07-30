import { useState } from 'react';
import type { LetterContent, PhotoEntry } from '../../types/content';
import { buttonLabels } from '../../content/buttons';
import { getPhotoPlacement } from './photoLayout';
import './LetterPage.css';

interface LetterPageProps {
  letter: LetterContent;
  photos: PhotoEntry[];
  onContinue: () => void;
}

/**
 * One handmade paper keepsake page: texture, corner doodles, the letter
 * text itself, and any embedded photos tucked in like Polaroids. Pure
 * presentation — all copy comes from `letter`/`photos` (from
 * `src/content/letters.ts` and `src/content/photos.ts`), nothing is
 * hardcoded here.
 */
export function LetterPage({ letter, photos, onContinue }: LetterPageProps) {
  return (
    <div className="letter-page">
      <div className="letter-page__sheet">
        <div className="letter-page__sheet-texture" aria-hidden="true" />
        <MoonDoodle className="letter-page__doodle letter-page__doodle--moon" />
        <VineDoodle className="letter-page__doodle letter-page__doodle--vine-top" />
        <FlowerDoodle className="letter-page__doodle letter-page__doodle--flower" />

        <div className="letter-page__scroll">
          <h1 className="letter-page__title">{letter.title}</h1>

          {letter.pages.map((page) => (
            <section className="letter-page__section" key={page.id}>
              {page.heading && <h2 className="letter-page__heading">{page.heading}</h2>}
              {page.body.map((paragraph, index) => (
                <p className="letter-page__paragraph" key={`${page.id}-${index}`}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {photos.length > 0 && (
            <div className="letter-page__photos">
              {photos.map((photo, index) => (
                <PhotoKeepsake key={photo.id} photo={photo} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <button type="button" className="letter-page__continue" onClick={onContinue}>
        <span className="letter-page__continue-seal" aria-hidden="true" />
        <span className="letter-page__continue-label">{buttonLabels.continue}</span>
      </button>
    </div>
  );
}

function PhotoKeepsake({ photo, index }: { photo: PhotoEntry; index: number }) {
  const [failed, setFailed] = useState(false);
  const { rotationDeg, offsetY } = getPhotoPlacement(photo.id, index);
  const style = {
    transform: `rotate(${rotationDeg}deg) translateY(${offsetY}px)`,
  };

  return (
    <figure className="letter-page__photo" style={style}>
      <div className="letter-page__photo-frame">
        {!failed ? (
          <img
            className="letter-page__photo-img"
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="letter-page__photo-fallback" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path
                d="M4 6h3l1.5-2h7L17 6h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
                fill="none"
                stroke="#b98f5e"
                strokeWidth="1.3"
              />
              <circle cx="12" cy="13" r="3.4" fill="none" stroke="#b98f5e" strokeWidth="1.3" />
            </svg>
          </div>
        )}
        <span className="letter-page__photo-pin" aria-hidden="true" />
      </div>
      {photo.caption && <figcaption className="letter-page__photo-caption">{photo.caption}</figcaption>}
    </figure>
  );
}

function MoonDoodle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 80 60" aria-hidden="true">
      <path
        d="M46 10c-11 0-20 9-20 20s9 20 20 20c3 0 6-.6 8.6-1.7-6-2.6-10.1-8.6-10.1-15.6s4.1-13 10.1-15.6C52 10.6 49 10 46 10Z"
        fill="currentColor"
      />
      <circle cx="16" cy="14" r="1.6" fill="currentColor" />
      <circle cx="10" cy="26" r="1.1" fill="currentColor" />
      <circle cx="22" cy="30" r="1.3" fill="currentColor" />
      <path d="M62 42l1.4 3.2L67 46.6l-3.6 1.4L62 51.2l-1.4-3.2L57 46.6l3.6-1.4Z" fill="currentColor" />
    </svg>
  );
}

function VineDoodle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 60 140" aria-hidden="true">
      <path
        d="M8 4C4 30 14 48 8 70c-6 22 6 42 2 66"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <ellipse cx="16" cy="22" rx="7" ry="3.4" fill="currentColor" transform="rotate(-30 16 22)" />
      <ellipse cx="4" cy="52" rx="7" ry="3.4" fill="currentColor" transform="rotate(28 4 52)" />
      <ellipse cx="16" cy="88" rx="7" ry="3.4" fill="currentColor" transform="rotate(-24 16 88)" />
      <ellipse cx="6" cy="120" rx="7" ry="3.4" fill="currentColor" transform="rotate(30 6 120)" />
    </svg>
  );
}

function FlowerDoodle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 70 70" aria-hidden="true">
      <g fill="currentColor" opacity="0.9">
        <ellipse cx="35" cy="18" rx="7" ry="11" />
        <ellipse cx="35" cy="52" rx="7" ry="11" />
        <ellipse cx="18" cy="35" rx="11" ry="7" />
        <ellipse cx="52" cy="35" rx="11" ry="7" />
        <ellipse cx="23" cy="23" rx="8" ry="6" transform="rotate(45 23 23)" />
        <ellipse cx="47" cy="47" rx="8" ry="6" transform="rotate(45 47 47)" />
        <ellipse cx="47" cy="23" rx="8" ry="6" transform="rotate(-45 47 23)" />
        <ellipse cx="23" cy="47" rx="8" ry="6" transform="rotate(-45 23 47)" />
      </g>
      <circle cx="35" cy="35" r="7" fill="#f2c94c" />
    </svg>
  );
}
