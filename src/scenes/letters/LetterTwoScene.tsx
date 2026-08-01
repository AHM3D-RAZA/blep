import { LetterPage } from './LetterPage';
import { letterTwo } from '../../content/letters';
import { photos } from '../../content/photos';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';
import './LetterTwoScene.css';

const letterTwoPhotos = photos.filter((photo) => photo.id === 'photo-2');

/**
 * The second letter scene: a transparent overlay on top of the
 * persistent meadow — same pattern as `LetterOneScene`, reusing the
 * shared `LetterPage` keepsake (paper texture, moon/vine/flower
 * doodles, embedded photo). Warmer and more reflective than the first
 * letter comes through in the content itself (`letterTwo` in
 * `src/content/letters.ts`), and this is the last letter, so its
 * continue control is labeled toward the Promise Tree ending instead
 * of the generic "continue".
 */
export default function LetterTwoScene({ onNext }: SceneProps) {
  return (
    <div className="letter-two-scene">
      <LetterPage
        letter={letterTwo}
        photos={letterTwoPhotos}
        onContinue={onNext}
        continueLabel={buttonLabels.toPromiseTree}
      />
    </div>
  );
}
