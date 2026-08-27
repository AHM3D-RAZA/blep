import { useState } from 'react';
import { wishPrompt } from '../../content/site';
import './WishPrompt.css';

interface WishPromptProps {
  /** Called once the prompt has fully faded away — safe to start the comet after this. */
  onSent: () => void;
}

const FADE_OUT_MS = 550;

/**
 * "Make a wish… ✦ / tap to send it" — the tap that kicks off the
 * night-sky wish's comet. A quiet handwritten invite rather than a
 * button, but it's explicitly tappable and says so, per the brief:
 * she shouldn't have to guess the sky is interactive here.
 */
export function WishPrompt({ onSent }: WishPromptProps) {
  const [sending, setSending] = useState(false);

  const handleTap = () => {
    if (sending) return;
    setSending(true);
    window.setTimeout(onSent, FADE_OUT_MS);
  };

  return (
    <button
      type="button"
      className={`wish-prompt${sending ? ' wish-prompt--sending' : ''}`}
      onClick={handleTap}
      aria-label={`${wishPrompt.invite} ${wishPrompt.hint}`}
    >
      <span className="wish-prompt__invite">{wishPrompt.invite}</span>
      <span className="wish-prompt__hint">{wishPrompt.hint}</span>
    </button>
  );
}
