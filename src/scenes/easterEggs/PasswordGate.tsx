import { useEffect, useRef, useState, type FormEvent } from 'react';
import { passwordGate } from '../../content/passwordGate';
import './PasswordGate.css';

type Stage = 'question' | 'correct' | 'wrong';

const CORRECT_ADVANCE_MS = 2000; // how long the "correct" celebration holds before onPass fires
const CHICKEN_OUT_AFTER = 2; // wrong tries before the skip option appears

interface PasswordGateProps {
  /**
   * Called once she's actually allowed to proceed — either a correct
   * answer (after a short celebratory beat) or the "chicken out" skip.
   * This gate is mandatory: unlike the rest of the Easter eggs, there's
   * no close button and no backdrop-tap-to-dismiss, since the whole
   * point is that Letter Two's ending doesn't continue until this
   * either passes or is explicitly skipped.
   */
  onPass: () => void;
}

/**
 * The "Only You" identity-verification gate. Shown when she taps Letter
 * Two's "One Last Thing..." control — see `LetterTwoScene.tsx`, which
 * holds off on actually starting the fold-into-lantern transition until
 * `onPass` fires here.
 */
export function PasswordGate({ onPass }: PasswordGateProps) {
  const [value, setValue] = useState('');
  const [stage, setStage] = useState<Stage>('question');
  // Which inline hint to show for a wrong answer — generic, or the
  // special one if it was specifically the sender's own name.
  const [hint, setHint] = useState(passwordGate.genericReplyBody);
  const [wrongCount, setWrongCount] = useState(0);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const answer = value.trim().toLowerCase();
    if (!answer) return;

    const isCorrect = passwordGate.correctAnswers.some((name) => name.trim().toLowerCase() === answer);
    if (isCorrect) {
      setStage('correct');
      advanceTimerRef.current = setTimeout(onPass, CORRECT_ADVANCE_MS);
      return;
    }

    // "Razey"/"Raza" etc. get their own playful line, but otherwise
    // they're treated exactly like any other wrong answer — the input
    // stays open for another try, nothing gets replaced.
    const isSender = passwordGate.senderAliases.some((name) => name.trim().toLowerCase() === answer);
    setHint(isSender ? passwordGate.senderReplyMessage : passwordGate.genericReplyBody);
    setStage('wrong');
    setWrongCount((n) => n + 1);
  };

  return (
    <div className="password-gate-overlay" role="dialog" aria-label={passwordGate.title}>
      <div className="password-gate-card">
        <span className="password-gate-card__stamp" aria-hidden="true">
          ✦
        </span>
        <p className="password-gate-card__title">{passwordGate.title}</p>

        {stage === 'question' || stage === 'wrong' ? (
          <form className="password-gate-card__form" onSubmit={handleSubmit}>
            <p className="password-gate-card__question">{passwordGate.question}</p>
            <input
              type="text"
              className="password-gate-card__input"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (stage === 'wrong') setStage('question');
              }}
              placeholder={passwordGate.placeholder}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck={false}
              enterKeyHint="done"
              autoFocus
            />
            {stage === 'wrong' && <p className="password-gate-card__hint">{hint}</p>}
            <button type="submit" className="password-gate-card__submit">
              {passwordGate.submitLabel}
            </button>
            {wrongCount >= CHICKEN_OUT_AFTER && (
              <button type="button" className="password-gate-card__chicken-out" onClick={onPass}>
                {passwordGate.chickenOutLabel}
              </button>
            )}
          </form>
        ) : (
          <div className="password-gate-card__result">
            <p className="password-gate-card__result-heading">{passwordGate.correctHeading}</p>
            <p className="password-gate-card__result-body">{passwordGate.correctBody}</p>
            <Sparkles />
          </div>
        )}
      </div>
    </div>
  );
}

function Sparkles() {
  // A small, tasteful celebratory burst — six points radiating outward
  // and fading, not a confetti library or anything heavy.
  const points = [0, 60, 120, 180, 240, 300];
  return (
    <span className="password-gate-card__sparkles" aria-hidden="true">
      {points.map((angle) => (
        <span key={angle} className="password-gate-card__spark" style={{ '--spark-angle': `${angle}deg` } as React.CSSProperties}>
          ✦
        </span>
      ))}
    </span>
  );
}
