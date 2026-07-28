import type { ButtonLabels } from '../types/content';

/**
 * All reusable button/control copy in one place. Components should read
 * labels from here rather than hardcoding strings like "Next" or "Play".
 */
export const buttonLabels: ButtonLabels = {
  continue: 'continue',
  next: 'next',
  replay: 'replay',
  download: 'download',
  visitAgain: 'visit again',
  openEnvelope: 'open',
  play: 'play',
  pause: 'pause',
  explore: 'stay a while',
  skip: 'skip',
};
