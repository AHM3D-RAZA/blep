import type { DaisyGameContent } from '../types/content';

/**
 * Copy for the rigged "He Loves Me... He Loves Me More" daisy Easter
 * egg. Everything here is safe to edit freely — just keep every line
 * in `results` positive; see the note on that field in types/content.ts.
 */
export const daisyGame: DaisyGameContent = {
  prompt: 'He loves me… he loves me not…',
  // Shown in random order (a fresh shuffle each time the game opens,
  // never the same one twice in a row) as each petal — except the
  // last — gets plucked. Add or edit lines here freely.
  petalMessages: [
    'He loves you.',
    'He loves you more.',
    'He loves you even more.',
    'He loves you a lot.',
    'He loves you dearly.',
    'He loves you so passionately.',
    'He loves you endlessly.',
    'He loves you truly.',
    'He loves you completely.',
  ],
  // Shown once, after the very last petal — one is picked at random
  // each time the game opens. Add or edit lines here too; just keep
  // every line positive, since the whole point of the game is that
  // it's rigged to never land anywhere else.
  results: [
    'He loves you.',
    'He loves you more.',
    'He loves you more than garlic bread.',
    'He loves you an unreasonable amount.',
    'He loves you. Obviously.',
    'He loves you… forever.',
  ],
};
