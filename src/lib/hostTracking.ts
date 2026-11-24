// Host « Suivi » page: one badge per cleaning request and per connection
// request. The backend computes `trackingStatus` on every schedule; the
// fallback below only covers a server that does not send it yet.

import type { CleanerAssignment, CleaningSchedule, TrackingStatus } from '@/redux/types';

export type Tone = 'waiting' | 'action' | 'success' | 'danger' | 'muted';

export const TONE_COLORS: Record<Tone, { fg: string; bg: string }> = {
  waiting: { fg: '#B35A00', bg: '#FF8D281A' },
  action: { fg: '#0070D1', bg: '#0088FF14' },
  success: { fg: '#1D9E75', bg: '#22C55E1A' },
  danger: { fg: '#D92D20', bg: '#FF383C14' },
  muted: { fg: '#606060', bg: '#8F8F8F1A' },
};

export const TRACKING_META: Record<TrackingStatus, { label: string; tone: Tone }> = {
  awaiting_response: { label: 'Awaiting response', tone: 'waiting' },
  to_pay: { label: 'To pay', tone: 'action' },
  awaiting_cash_approval: { label: 'Off-app payment awaiting confirmation', tone: 'waiting' },
  confirmed: { label: 'Confirmed', tone: 'success' },
  not_done: { label: 'Not done', tone: 'danger' },
  proof_to_validate: { label: 'Proof to validate', tone: 'action' },
  problem: { label: 'Problem reported', tone: 'danger' },
  done: { label: 'Done', tone: 'success' },
  refused: { label: 'Refused', tone: 'danger' },
  expired: { label: 'Expired – no answer', tone: 'muted' },
  cancelled: { label: 'Cancelled', tone: 'muted' },
};

/** The backend badge, or the same rule worked out from the raw fields. */
export const trackingStatusOf = (schedule: CleaningSchedule): TrackingStatus => {
  if (schedule.trackingStatus && TRACKING_META[schedule.trackingStatus]) {
    return schedule.trackingStatus;
  }
  switch (schedule.status) {
    case 'scheduled':
      return 'awaiting_response';
    case 'refused':
      return 'refused';
    case 'expired':
      return 'expired';
    case 'cancelled':
      return 'cancelled';
    case 'proof_submitted':
      return 'proof_to_validate';
    case 'completed':
      return 'done';
    case 'disputed':
      return 'problem';
    case 'accepted':
    case 'in_progress':
      if (schedule.paymentStatus === 'handcash_pending') return 'awaiting_cash_approval';
      return schedule.paymentStatus === 'unpaid' ? 'to_pay' : 'confirmed';
    default:
      return 'awaiting_response';
  }
};

/** Steps of a request's progress line. */
export const PROGRESS_STEPS = ['Sent', 'Accepted', 'Paid', 'Done'] as const;

/**
 * How many steps are reached (1-4), or null when the request ended without
 * going through (refused, expired, cancelled): those show only the badge.
 */
export const progressOf = (status: TrackingStatus): number | null => {
  switch (status) {
    case 'awaiting_response':
      return 1;
    case 'to_pay':
    case 'awaiting_cash_approval':
      return 2;
    case 'confirmed':
    case 'not_done':
    case 'proof_to_validate':
    case 'problem':
      return 3;
    case 'done':
      return 4;
    default:
      return null;
  }
};

export const CONNECTION_META: Record<CleanerAssignment['status'], { label: string; tone: Tone }> = {
  pending: { label: 'Awaiting response', tone: 'waiting' },
  accepted: { label: 'Accepted', tone: 'success' },
  refused: { label: 'Refused', tone: 'danger' },
  left: { label: 'Collaboration ended', tone: 'muted' },
};
