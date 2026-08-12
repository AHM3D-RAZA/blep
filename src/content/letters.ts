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
      heading: 'if you\u2019re still here with me',
      body: [
        'the song is still humming somewhere behind my ribs, so forgive me if this page feels a little quieter than the last one.',
        'I wanted to write this part after the music, not before it \u2014 because this is the version of me that just spent a few minutes only thinking about you.',
      ],
    },
    {
      id: 'letterTwo-page-2',
      heading: 'the things I don\u2019t say enough',
      body: [
        'you make the ordinary parts of my life feel like they belong in a story. the boring errands, the late replies, the tired days \u2014 they all soften a little because you\u2019re somewhere in them.',
        'I am not always good at saying this out loud, so I\u2019m saying it here instead, where it can\u2019t get lost: I notice you. all of you. the loud days and the quiet ones.',
      ],
    },
    {
      id: 'letterTwo-page-3',
      heading: 'under the same moon',
      body: [
        'wherever you\u2019re reading this from, I like knowing the same moon is somewhere above you too, just on a different clock.',
        'so here\u2019s the rest of the walk \u2014 a little further into the evening, toward the one place in this whole meadow that\u2019s just for us.',
      ],
    },
  ],
};

export const letters: LetterContent[] = [letterOne, letterTwo];
