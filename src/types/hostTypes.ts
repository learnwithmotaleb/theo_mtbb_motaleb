// ── Task Status ───────────────────────────────────────────────────────────────
export type TaskStatus =
    | 'refused'
    | 'completed'
    | 'pending_accept'
    | 'scheduled'
    | 'report_problem';

export type Task = {
    id: string;
    status: TaskStatus;
    statusLabel: string;
    apartmentName: string;
    timeAgo: string;
    cleanerName: string;
    cleanerImage: any;
    apartmentImage: any;
    address: string;
    date: string;
    checkOut: string;
    checkIn: string;
    price: number;
    serviceFee: number;
};

// ── Recommended Schedule ──────────────────────────────────────────────────────
export type RecommendedSchedule = {
    id: string;
    apartmentName: string;
    idealDate: string;
    timeSlot: string;
    cleanerName: string;
    cleanerImage: any;
    apartmentImage: any;
};
    