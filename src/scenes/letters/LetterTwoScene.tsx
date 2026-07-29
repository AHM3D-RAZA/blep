import { useMemo, useState } from 'react';
import { letterTwo } from '../../content/letters';
import { photos } from '../../content/photos';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';
import './LetterTwoScene.css';

/**
 * The second note — warmer and more reflective than the first. Built as a
 * scrapbook page tucked into the same dusky part of the day the audio
 * scene left off in: paper texture, moon/star/flower doodles, botanical
 * corners, and (when one fits) a taped-in photo, ending in a clearly
 * labeled walk toward the Promise Tree.
 */
export default function LetterTwoScene({ onNext }: SceneProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [photoFailed, setPhotoFailed] = useState(false);

  const pages = letterTwo.pages;
  const page = pages[pageIndex];
  const isLastPage = pageIndex === pages.length - 1;

  // A photo only appears on the final page, tucked in beside the closing
  // words — and only if the configured file actually loads.
  const photo = useMemo(() => photos[0], []);

  const goForward = () => {
    if (isLastPage) {
      onNext();
      return;
    }
    setPageIndex((i) => Math.min(i + 1, pages.length - 1));
  };

  return (
    <div className="letter-two">
      <div className="letter-two__sky" aria-hidden="true" />
      <MoonAndStars />

      <div className="letter-two__page-wrap">
        <article className="letter-two__page" key={page.id}>
          <span className="letter-two__tape letter-two__tape--left" aria-hidden="true" />
          <span className="letter-two__tape letter-two__tape--right" aria-hidden="true" />

          <BotanicalCorner className="letter-two__doodle letter-two__doodle--tl" />
          <FlowerSketch className="letter-two__doodle letter-two__doodle--br" />

          <p className="letter-two__eyebrow">{letterTwo.title}</p>
          {page.heading && <h1 className="letter-two__heading">{page.heading}</h1>}

          <div className="letter-two__body">
            {page.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {isLastPage && photo && !photoFailed && (
            <figure className="letter-two__photo">
              <span className="letter-two__tape letter-two__tape--photo" aria-hidden="true" />
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                onError={() => setPhotoFailed(true)}
              />
              {photo.caption && <figcaption>{photo.caption}</figcaption>}
            </figure>
          )}

          <div className="letter-two__footer">
            <div className="letter-two__dots" aria-hidden="true">
              {pages.map((p, i) => (
                <span key={p.id} className={i === pageIndex ? 'is-active' : ''} />
              ))}
            </div>

            <button type="button" className="letter-two__button" onClick={goForward}>
              {isLastPage ? buttonLabels.toPromiseTree : buttonLabels.continue}
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

function MoonAndStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: `${(i * 41) % 100}%`,
        top: `${(i * 29) % 60}%`,
        delay: `${(i % 6) * 0.7}s`,
      })),
    [],
  );

  return (
    <div className="letter-two__celestial" aria-hidden="true">
      {stars.map((s) => (
        <span key={s.id} className="letter-two__star" style={{ left: s.left, top: s.top, animationDelay: s.delay }} />
      ))}
      <svg className="letter-two__moon" viewBox="0 0 60 60" aria-hidden="true">
        <path
          d="M38 6a24 24 0 1 0 16 34A20 20 0 0 1 38 6z"
          fill="#fff6d7"
          opacity="0.92"
        />
      </svg>
    </div>
  );
}

function BotanicalCorner({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 90 90" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M6 6c14 2 24 12 26 26" />
        <path d="M10 10c6 8 6 18 2 24" />
        <path d="M14 8c10 4 16 12 18 22" />
        <circle cx="30" cy="30" r="3" />
        <path d="M6 20c6-2 11 1 13 6" />
        <path d="M20 6c-2 6 1 11 6 13" />
      </g>
    </svg>
  );
}

function FlowerSketch({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 90 90" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <circle cx="45" cy="30" r="7" />
        <path d="M45 23a8 8 0 1 1-8 8 8 8 0 0 1 8-8Z" />
        <path d="M45 37a8 8 0 1 0 8 8 8 8 0 0 0-8-8Z" />
        <path d="M38 30a8 8 0 1 0-8-8 8 8 0 0 0 8 8Z" />
        <path d="M52 30a8 8 0 1 0 8-8 8 8 0 0 0-8 8Z" />
        <path d="M45 46v30" />
        <path d="M45 60c-8 0-12 6-12 12" />
        <path d="M45 68c8 0 12 5 13 10" />
      </g>
    </svg>
  );
}
