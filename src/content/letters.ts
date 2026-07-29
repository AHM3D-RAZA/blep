import type { LetterContent } from '../types/content';

/**
 * Letter content. Each letter is a list of pages, each page a list of
 * paragraphs. The envelope/letter modules should render these directly
 * rather than hardcoding any text in components.
 */

export const letterOne: LetterContent = {
  id: 'letterOne',
  title: 'the first letter',
  pages: [
    {
      id: 'letterOne-page-1',
      heading: 'to start with',
      body: ['[ letter one placeholder text goes here ]'],
    },
  ],
};

export const letterTwo: LetterContent = {
  id: 'letterTwo',
  title: 'the second letter',
  pages: [
    {
      id: 'letterTwo-page-1',
      heading: 'a little further in',
      body: ['[ letter two placeholder text goes here ]'],
    },
  ],
};

export const letters: LetterContent[] = [letterOne, letterTwo];
