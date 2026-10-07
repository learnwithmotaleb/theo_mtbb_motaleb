// Options shared by the create / edit accommodation screens and every screen
// that displays an accommodation. Values are the English source strings the
// backend stores; the UI always renders them through `t()`.

import { t as translate, type Translate } from '@/i18n';

/** The values the backend accepts for `accommodationType`. */
export const ACCOMMODATION_TYPES = ['Apartment', 'House', 'Studio', 'Other'] as const;
export type AccommodationType = (typeof ACCOMMODATION_TYPES)[number];

/**
 * Floor and elevator only make sense for a unit inside a building. A house
 * (or "other") never gets asked about them, and its stored values are cleared
 * so a type change cannot leave a stale floor behind.
 */
export const hasFloorAndElevator = (type?: string | null): boolean =>
  type === 'Apartment' || type === 'Studio';

/** How the cleaner gets the keys. */
export const KEY_OPTIONS = ['Key box', 'Hand delivery'] as const;

/** "3 rooms (T3)" in the dropdown; the API wants the number. */
export const ROOM_OPTIONS = [
  '1 room (T1)',
  '2 rooms (T2)',
  '3 rooms (T3)',
  '4 rooms (T4)',
  '5+ rooms',
] as const;

export const roomsToNumber = (label: string): string =>
  label ? String(parseInt(label, 10) || '') : '';

/** Stored number -> dropdown label, or '' when nothing was chosen yet. */
export const roomsToLabel = (value?: string | number | null): string => {
  const n = Number(value);
  if (!n) return '';
  return ROOM_OPTIONS.find((option) => parseInt(option, 10) === n) ??
    (n >= 5 ? ROOM_OPTIONS[4] : '');
};

/** "3 pièces" / "3 rooms". */
export const roomsText = (value?: string | number | null, t: Translate = translate): string => {
  const n = Number(value);
  if (!n) return '';
  return n === 1 ? t('1 room') : t('{n} rooms', { n });
};

/** Translated key-handover label; older values ("Under the doormat") still read. */
export const keysText = (value?: string | null, t: Translate = translate): string =>
  value ? t(value) : '';

export const elevatorText = (hasElevator?: boolean | null, t: Translate = translate): string =>
  hasElevator ? t('Yes') : t('No');
