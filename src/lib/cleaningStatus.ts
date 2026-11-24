import { toDateKey } from '@/lib/datetime';
import type { ScheduleStatus } from '@/redux/types';

/**
 * What a cleaning means for the cleaner, as one of a few clear badges.
 *
 * Backend lifecycle (see schedule service):
 *   scheduled -> (cleaner accepts) in_progress -> (proof sent) proof_submitted
 *   -> (host validates) completed. If the host rejects the proof it goes back
 *   to in_progress, so the badge falls back to "To do" on its own.
 * `accepted` is legacy data only but is kept in the mapping.
 */
export type CleaningBadgeKind = 'waiting' | 'todo' | 'done' | 'dispute' | 'refused';

export interface CleaningBadge {
    kind: CleaningBadgeKind;
    /** English key, translated with t() at render time. */
    label: string;
    color: string;
    background: string;
}

const BADGES: Record<CleaningBadgeKind, CleaningBadge> = {
    waiting: {
        kind: 'waiting',
        label: 'Waiting for your response',
        color: '#B25E00',
        background: '#FFF1DC',
    },
    todo: {
        kind: 'todo',
        label: 'To do',
        color: '#0068C9',
        background: '#E3F1FF',
    },
    done: {
        kind: 'done',
        label: 'Cleaning done',
        color: '#1B7F3B',
        background: '#E2F6E8',
    },
    dispute: {
        kind: 'dispute',
        label: 'Dispute',
        color: '#C62828',
        background: '#FDE4E4',
    },
    refused: {
        kind: 'refused',
        label: 'Refused',
        color: '#606060',
        background: '#EDEDED',
    },
};

/** Badge for a schedule status, or null for ones never shown (cancelled). */
export const cleaningBadge = (status?: ScheduleStatus | string | null): CleaningBadge | null => {
    switch (status) {
        case 'scheduled':
            return BADGES.waiting;
        case 'accepted':
        case 'in_progress':
            return BADGES.todo;
        case 'proof_submitted':
        case 'completed':
            return BADGES.done;
        case 'disputed':
            return BADGES.dispute;
        case 'refused':
            return BADGES.refused;
        default:
            return null;
    }
};

/**
 * A cleaning request the cleaner can still answer — the same rule the backend
 * applies to `?status=scheduled`: not answered yet (status `scheduled` =
 * cleanerResponse `pending`) and dated today or later. Anything accepted,
 * refused or expired, or whose day has passed, is not a pending request.
 */
export const isPendingCleaningRequest = (mission: {
    status?: string | null;
    cleanerResponse?: string | null;
    dayKey?: string | null;
    date?: string | null;
}): boolean => {
    if (mission.status !== 'scheduled') return false;
    if ((mission.cleanerResponse ?? 'pending') !== 'pending') return false;
    const day = mission.dayKey || (mission.date ? toDateKey(mission.date) : '');
    return !day || day >= toDateKey(new Date());
};
