import type { TimelineEntry, OurTimeLabels } from '../types/content';

/**
 * Relationship milestones for the timeline. Format for `date` is
 * ISO 8601 (YYYY-MM-DD) so later modules can parse it directly.
 */
export const timeline: TimelineEntry[] = [
  {
    id: 'timeline-1',
    date: '2024-01-01',
    title: '[ milestone placeholder ]',
  },
];

/**
 * Relationship start date, used by the live relationship timer Easter egg.
 * ISO 8601 format, interpreted in `relationshipStartTimezone`.
 */
export const relationshipStartDate = '2024-01-01T00:00:00';
export const relationshipStartTimezone = 'Asia/Karachi';

/**
 * IANA timezone identifiers for the live time display Easter egg.
 * Kept as a config map so the timer logic never hardcodes timezone strings.
 */
export const timezones = {
  pakistan: 'Asia/Karachi',
  philippines: 'Asia/Manila',
} as const;

/**
 * Display copy for the "Our Time" Easter egg (hidden near Letter One).
 * `hereTimezoneKey`/`thereTimezoneKey` must match keys in `timezones`
 * above. Everything here is safe to edit freely.
 */
export const ourTimeLabels: OurTimeLabels = {
  title: 'RASSA CLOCK',
  hereLabel: "I'm here...",
  thereLabel: "while you're there...",
  hereTimezoneKey: 'pakistan',
  thereTimezoneKey: 'philippines',
  hereName: 'Pakistan',
  thereName: 'Philippines',
  durationIntro: "we've been RASSA for",
};
