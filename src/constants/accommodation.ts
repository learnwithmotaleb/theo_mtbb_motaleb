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

/** A lockbox code only means something when the keys are in a key box. */
export const usesKeyBox = (keys?: string | null): boolean => keys === 'Key box';

/** Backend limit on `accessCode` / `doorCode`. */
export const ACCESS_CODE_MAX_LENGTH = 200;

/**
 * Guest departure / next arrival times: 05:00 → 23:30 every 30 minutes, the
 * same "HH:mm" the backend stores. The slot stays within one day (departure
 * before arrival): the app's slot display orders the two times by clock.
 */
export const TURNOVER_TIME_OPTIONS: string[] = Array.from({ length: 38 }, (_, i) => {
  const minutes = 5 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${minutes % 60 ? '30' : '00'}`;
});

/** Arrival times that can follow this departure ("HH:mm" sorts by clock). */
export const arrivalOptionsAfter = (departure?: string | null): string[] =>
  departure ? TURNOVER_TIME_OPTIONS.filter((time) => time > departure) : TURNOVER_TIME_OPTIONS;

/** Departure times that leave at least one later arrival. */
export const DEPARTURE_TIME_OPTIONS = TURNOVER_TIME_OPTIONS.slice(0, -1);

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
