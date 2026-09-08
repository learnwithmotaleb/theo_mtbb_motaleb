// Cleaning price breakdown — mirrors the backend escrow model so the UI never
// shows a total different from what the host is actually charged.
//
// Backend (payment.service.ts):
//   cleanerAmount = agreed pricePerCleaning / cleaningRate  <- paid out in full
//   platformFee   = round(cleanerAmount * feePercent / 100) <- platform keeps this
//   amount        = cleanerAmount + platformFee             <- what the host pays
//
// The fee is added ON TOP of the cleaner's rate, never deducted from it: the
// cleaner is paid their full rate and only ever sees that number.

// Fallback only — the live value comes from GET /settings/public.
import { intlLocale } from '@/i18n';

export const PLATFORM_FEE_PERCENT = 5;

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
