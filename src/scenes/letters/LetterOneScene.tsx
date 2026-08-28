import { LetterPage } from './LetterPage';
import { letterOne } from '../../content/letters';
import { photos } from '../../content/photos';
import { buttonLabels } from '../../content/buttons';
import type { SceneProps } from '../sceneTypes';
import './LetterOneScene.css';

/**
 * The first letter scene: a transparent overlay on top of the persistent
 * meadow — no background of its own. The paper sheet itself (see
 * `LetterPage.css`) is opaque enough to stay readable no matter what the
 * meadow's day/night cycle is doing behind it.
 */
export default function LetterOneScene({ onNext }: SceneProps) {
  return (
    <div className="letter-one-scene">
      <LetterPage
        letter={letterOne}
        photos={photos}
        onContinue={onNext}
        continueLabel={buttonLabels.hearMyVoice}
      />
    </div>
  );
}
