export type PlatformType = 'airbnb' | 'booking' | 'vrbo' | 'other';

export type CalendarEvent = {
    id: string;
    scheduleId?: string;          // set only when a cleaning exists
    date: number;        // day of month
    checkIn: string;
    checkOut: string;
    platform: PlatformType;
    cleanerImage: any;
    hasManualCleaning?: boolean;
    cleaningTime: string;
};

export type ListEvent = {
    id: string;
    scheduleId?: string;          // set only when a cleaning exists
    checkIn: string;
    checkOut: string;
    platform: PlatformType;
    cleanerImage: any;
    cleaningLabel: string;
    cleaningTime: string;
    hasManualCleaning?: boolean;
};

export const PLATFORM_COLORS: Record<PlatformType, string> = {
    airbnb:  '#F64B7C',
    booking: '#4B6DF6',
    vrbo:    '#1A1A2E',
    other:   '#666666',
};
