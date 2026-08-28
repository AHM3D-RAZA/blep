import type { PasswordGateContent } from '../types/content';

/**
 * Copy for the "Only You" password-gate Easter egg, hidden in Letter
 * Two. Everything here is safe to edit freely.
 */
export const passwordGate: PasswordGateContent = {
  title: 'identity verification required',
  question: 'Who is the prettiest, smartest, most gorgeous person in this room?',
  placeholder: 'type your answer…',
  submitLabel: 'lock answer',
  correctAnswers: ['Issu', 'Issa', 'Larissa'],
  senderAliases: ['Razey', 'Raza'],
  correctHeading: 'Correct. Ofcourse its you, my very pretty Issu ❤️',
  correctBody: 'identity confirmed. you may proceed.',
  senderReplyMessage: 'HEHE Nice try buster, but we both know ze korrique answer',
  genericReplyBody: 'hmm, not quite — try again?',
  chickenOutLabel: "i want to chicken out",
};
