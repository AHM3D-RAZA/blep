import type { KeyboardEvent } from 'react';
import { siteIdentity } from '../../content/site';
import { buttonLabels } from '../../content/buttons';
import { useEnvelopeSequence } from './envelopeMotion';
import './Envelope.css';

interface EnvelopeProps {
  /** Called when the user taps the peeking letter in the 'opened' stage. */
  onReadLetter: () => void;
}

/**
 * The handcrafted envelope itself — idle float, wax seal, tap-to-open,
 * and the letter peeking out once opened. `EnvelopeScene.tsx` supplies
 * the meadow it sits in; this component only knows about the envelope.
 */
export function Envelope({ onReadLetter }: EnvelopeProps) {
  const { stage, open } = useEnvelopeSequence();

  const isClosed = stage === 'closed';
  const isOpened = stage === 'opened';
  const flapOpen = stage === 'opening' || stage === 'opened';
  const sealBroken = stage !== 'closed';

  const handleEnvelopeActivate = () => {
    if (isClosed) open();
  };

  const handleEnvelopeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isClosed) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  };

  const handleLetterKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onReadLetter();
    }
  };

  return (
    <div className={`envelope envelope--${stage}`}>
      <div className="envelope__shadow" aria-hidden="true" />

      <div
        className="envelope__stage"
        role={isClosed ? 'button' : undefined}
        tabIndex={isClosed ? 0 : -1}
        aria-label={isClosed ? `${buttonLabels.openEnvelope} — a letter from ${siteIdentity.senderName}` : undefined}
        onClick={handleEnvelopeActivate}
        onKeyDown={handleEnvelopeKeyDown}
      >
        {/* back panel of the envelope, always present */}
        <div className="envelope__body" aria-hidden="true" />

        {/* the letter itself, tucked inside and sliding up as it opens */}
        <button
          type="button"
          className="envelope__letter-peek"
          onClick={(event) => {
            event.stopPropagation();
            if (isOpened) onReadLetter();
          }}
          onKeyDown={handleLetterKeyDown}
          tabIndex={isOpened ? 0 : -1}
          aria-hidden={!isOpened}
          aria-label={isOpened ? buttonLabels.continue : undefined}
        >
          <span className="envelope__letter-peek-edge" aria-hidden="true" />
          {isOpened && (
            <span className="envelope__letter-peek-hint">{buttonLabels.continue}</span>
          )}
        </button>

        {/* lower pocket that keeps the letter tucked until the flap opens */}
        <div className="envelope__pocket" aria-hidden="true" />

        {/* the folding flap with the wax seal on top of it */}
        <div className={`envelope__flap ${flapOpen ? 'envelope__flap--open' : ''}`} aria-hidden="true" />

        <div className={`envelope__seal ${sealBroken ? 'envelope__seal--broken' : ''}`} aria-hidden="true">
          <span className="envelope__seal-half envelope__seal-half--left" />
          <span className="envelope__seal-half envelope__seal-half--right" />
          <span className="envelope__seal-mark">
            {siteIdentity.senderName.charAt(0)}
            <span className="envelope__seal-mark-amp">&amp;</span>
            {siteIdentity.recipientName.charAt(0)}
          </span>
        </div>
      </div>

      {isClosed && (
        <p className="envelope__hint" aria-hidden="true">
          {buttonLabels.openEnvelope}
        </p>
      )}
    </div>
  );
}
