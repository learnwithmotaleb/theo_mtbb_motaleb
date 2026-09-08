// Date/time rendering for the app.
//
// Contract with the backend (see the timezone middleware): every timestamp is
// stored and returned in UTC, and every request carries an `x-timezone` header
// with this device's IANA zone so server-computed day grouping/labels match
// what the user sees. Here we only ever render in device-local time — never
// hardcode an offset, and always send date-picker values as `YYYY-MM-DD`.

import { intlLocale } from '@/i18n';

export const deviceTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

// Backend occasionally emits bare (non-Z) ISO strings; treat those as UTC.
export const parseDate = (value?: string | number | Date | null): Date | null => {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') return new Date(value);

  const normalized =
    /^\d{4}-\d{2}-\d{2}T[\d:.]+$/.test(value) ? `${value}Z` : value;
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatDate = (
  value?: string | Date | null,
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' },
): string => {
  const d = parseDate(value);
  return d ? d.toLocaleDateString(intlLocale(), options) : '';
};

export const formatTime = (value?: string | Date | null): string => {
  const d = parseDate(value);
  return d ? d.toLocaleTimeString(intlLocale(), { hour: '2-digit', minute: '2-digit' }) : '';
};

export const formatDateTime = (value?: string | Date | null): string => {
  const d = parseDate(value);
  if (!d) return '';
  return `${formatDate(d)} · ${formatTime(d)}`;
};

// "HH:mm" / "HH:mm:ss" → localized clock label. Backend stores schedule
// check-in/out as plain wall-clock strings, so they are shown as-is.
export const formatClock = (hhmm?: string | null): string => {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':');
  if (h === undefined || m === undefined) return hhmm;
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
};

// Date → "YYYY-MM-DD" in device-local terms (what the backend expects for
// schedule dates; it resolves them against the x-timezone header).
export const toDateKey = (value: Date | string): string => {
  const d = parseDate(value);
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const relativeFromNow = (value?: string | Date | null): string => {
  const d = parseDate(value);
  if (!d) return '';
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
};
