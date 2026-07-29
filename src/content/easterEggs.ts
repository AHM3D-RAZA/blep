import type { EasterEggEntry } from '../types/content';

/**
 * Display text for each planned Easter egg. Trigger/interaction logic
 * belongs to the `feat/promise-eggs` module — this file only holds the
 * words shown once an egg is found.
 */
export const easterEggs: EasterEggEntry[] = [
  { id: 'daisy-game', label: 'he loves me…', text: '[ daisy game placeholder text ]' },
  { id: 'memory-bubbles', label: 'memory bubbles', text: '[ memory bubble placeholder text ]' },
  { id: 'password-gate', label: 'only you', text: '[ password gate placeholder text ]' },
  { id: 'dj-scratch', label: 'dj scratch', text: '[ dj scratch placeholder text ]' },
  { id: 'relationship-timer', label: 'how long now', text: '[ relationship timer placeholder text ]' },
  { id: 'compliment-daisy', label: 'infinite compliments', text: '[ compliment daisy placeholder text ]' },
  { id: 'butterfly-friend', label: 'butterfly friend', text: '[ butterfly placeholder text ]' },
  { id: 'secret-sunflower', label: 'secret sunflower', text: '[ sunflower placeholder text ]' },
  { id: 'shooting-star', label: 'shooting star', text: '[ shooting star placeholder text ]' },
];
