// Cleaning price breakdown shown to the host.
//
// Payment is settled directly between the host and the cleaner, outside the
// app, so Gestlio adds no service fee: the total is the cleaner's agreed rate
// (assignment pricePerCleaning, else the accommodation's cleaningRate). The
// fee field stays in the breakdown so a percentage can be reinstated in one
// place if the business model changes.

import { intlLocale } from '@/i18n';

export const PLATFORM_FEE_PERCENT = 0;

export interface SchedulePrice {
  /** Total the host is charged: cleaner's rate + service fee. */
  total: number;
  /** Platform's cut, charged on top of the cleaner's rate. */
  serviceFee: number;
  /** The cleaner's rate — what actually reaches the cleaner. */
  cleaningService: number;
  /** Fee percentage used for this breakdown. */
  feePercent: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export const computeSchedulePrice = (
  pricePerCleaning?: number | null,
  cleaningRate?: number | null,
  feePercent: number = PLATFORM_FEE_PERCENT,
): SchedulePrice => {
  const base = Number(pricePerCleaning ?? cleaningRate ?? 0) || 0;
  const pct = Number.isFinite(feePercent) ? feePercent : PLATFORM_FEE_PERCENT;
  const serviceFee = round2((base * pct) / 100);
  return {
    total: round2(base + serviceFee),
    serviceFee,
    cleaningService: round2(base),
    feePercent: pct,
  };
};

/** Stripe amounts come back in cents. */
export const fromCents = (cents?: number | null) => round2((Number(cents) || 0) / 100);

export const formatMoney = (amount?: number | null, currency = 'EUR') => {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat(intlLocale(), {
      style: 'currency',
      currency: (currency || 'EUR').toUpperCase(),
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
};
