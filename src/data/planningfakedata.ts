import { IMAGE_COMPONENTS } from '@/constants/image.index';

export type PlanningTask = {
    id: string;
    apartmentName: string;
    address: string;
    time: string;
    estimation: string;
    image: any;
    date: string; // ISO "2026-06-09"
};

export type DayPlan = {
    date: string;
    tasks: PlanningTask[];
};

// আজকের date থেকে relative offset দিয়ে ISO string বানানো
// যাতে app যেদিনই খুলুক dates সবসময় match করে
function relativeDate(offsetDays: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

const D = {
    minus2: relativeDate(-2),
    minus1: relativeDate(-1),
    today:  relativeDate(0),
    plus1:  relativeDate(1),
    plus2:  relativeDate(2),
    plus3:  relativeDate(3),
    plus4:  relativeDate(4),
};

export const PLANNING_DATA: DayPlan[] = [
    {
        date: D.minus2,
        tasks: [
            {
                id: 'p1',
                apartmentName: 'Appartement T2 - City Center',
                address: '45 Rue de la Paix, Paris',
                time: '09:00 - 11:00',
                estimation: '2h',
                image: IMAGE_COMPONENTS.apartment2,
                date: D.minus2,
            },
            {
                id: 'p2',
                apartmentName: 'Studio Montmartre',
                address: '12 Rue Lepic, Paris 18e',
                time: '13:00 - 15:00',
                estimation: '2h',
                image: IMAGE_COMPONENTS.apartment4,
                date: D.minus2,
            },
        ],
    },
    {
        date: D.minus1,
        tasks: [
            {
                id: 'p3',
                apartmentName: 'Appartement T3 - Bastille',
                address: '8 Place de la Bastille, Paris',
                time: '10:00 - 14:00',
                estimation: '4h',
                image: IMAGE_COMPONENTS.apartment7,
                date: D.minus1,
            },
        ],
    },
    {
        date: D.today, // ← আজ
        tasks: [
            {
                id: 'p4',
                apartmentName: 'Appartement T2 - City Center',
                address: '45 Rue de la Paix, Paris',
                time: '10:00 - 14:00',
                estimation: '4h',
                image: IMAGE_COMPONENTS.apartment1,
                date: D.today,
            },
            {
                id: 'p5',
                apartmentName: 'Appartement T2 - City Center',
                address: '45 Rue de la Paix, Paris',
                time: '10:00 - 14:00',
                estimation: '4h',
                image: IMAGE_COMPONENTS.apartment5,
                date: D.today,
            },
            {
                id: 'p6',
                apartmentName: 'Penthouse Marais',
                address: '3 Rue des Rosiers, Paris 4e',
                time: '16:00 - 18:00',
                estimation: '2h',
                image: IMAGE_COMPONENTS.apartment3,
                date: D.today,
            },
        ],
    },
    {
        date: D.plus1,
        tasks: [
            {
                id: 'p7',
                apartmentName: 'Appartement T2 - City Center',
                address: '45 Rue de la Paix, Paris',
                time: '10:00 - 14:00',
                estimation: '4h',
                image: IMAGE_COMPONENTS.apartment1,
                date: D.plus1,
            },
            {
                id: 'p8',
                apartmentName: 'Appartement T2 - City Center',
                address: '45 Rue de la Paix, Paris',
                time: '10:00 - 14:00',
                estimation: '4h',
                image: IMAGE_COMPONENTS.apartment,
                date: D.plus1,
            },
        ],
    },
    {
        date: D.plus2,
        tasks: [
            {
                id: 'p9',
                apartmentName: 'Villa Saint-Germain',
                address: '22 Blvd Saint-Germain, Paris 6e',
                time: '09:00 - 13:00',
                estimation: '4h',
                image: IMAGE_COMPONENTS.apartment6,
                date: D.plus2,
            },
        ],
    },
    {
        date: D.plus3,
        tasks: [],
    },
    {
        date: D.plus4,
        tasks: [
            {
                id: 'p10',
                apartmentName: 'Studio Oberkampf',
                address: '5 Rue Oberkampf, Paris 11e',
                time: '11:00 - 13:00',
                estimation: '2h',
                image: IMAGE_COMPONENTS.apartment7,
                date: D.plus4,
            },
        ],
    },
];

export const ALL_PLANNING_TASKS: PlanningTask[] = PLANNING_DATA.flatMap(
    (d) => d.tasks
);


// calender data

export type PlatformType = 'airbnb' | 'booking' | 'vrbo' | 'other';

export type CalendarEvent = {
    id: string;
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
    checkIn: string;
    checkOut: string;
    platform: PlatformType;
    cleanerImage: any;
    cleaningLabel: string;
    cleaningTime: string;
    hasManualCleaning?: boolean;
};

export type PlanningProperty = {
    id: string;
    name: string;
    location: string;
    image: any;
    hasCalendarData: boolean;
};



export const PLANNING_PROPERTIES: PlanningProperty[] = [
    {
        id: '1',
        name: 'Appartement T3 – City Center',
        location: 'City Center',
        image: IMAGE_COMPONENTS.apartment,
        hasCalendarData: true,   // ← data আছে
    },
    {
        id: '2',
        name: 'Appartement T9 – City Center',
        location: 'Paris 12e',
        image: IMAGE_COMPONENTS.apartment2,
        hasCalendarData: false,  // ← empty
    },
    {
        id: '3',
        name: 'Appartement C11 – City Center',
        location: 'Paris 12e',
        image: IMAGE_COMPONENTS.apartment6,
        hasCalendarData: false,  // ← empty
    },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
    { id: '1', date: 1,  checkIn: 'Mon, Apr 2, 4:00 PM',  checkOut: 'Fri, Apr 5, 10:00 AM',  platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP, cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '2', date: 5,  checkIn: 'Mon, Apr 2, 4:00 PM',  checkOut: 'Fri, Apr 5, 10:00 AM',  platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP1, cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '3', date: 6,  checkIn: 'Mon, Apr 2, 4:00 PM',  checkOut: 'Fri, Apr 5, 10:00 AM',  platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP1, cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '4', date: 8,  checkIn: 'Mon, Apr 2, 4:00 PM',  checkOut: 'Fri, Apr 5, 10:00 AM',  platform: 'booking', cleanerImage: IMAGE_COMPONENTS.cleanerPP, cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '5', date: 11, checkIn: 'Mon, Apr 2, 4:00 PM',  checkOut: 'Fri, Apr 5, 10:00 AM',  platform: 'booking', cleanerImage: IMAGE_COMPONENTS.cleanerPP1, cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '6', date: 13, checkIn: 'Mon, Apr 2, 4:00 PM',  checkOut: 'Fri, Apr 5, 10:00 AM',  platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP, cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '7', date: 15, checkIn: 'Mon, Apr 2, 4:00 PM',  checkOut: 'Fri, Apr 5, 10:00 AM',  platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP, cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '8', date: 20, checkIn: 'Mon, Apr 2, 4:00 PM',  checkOut: 'Fri, Apr 5, 10:00 AM',  platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP1, cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '9', date: 25, checkIn: 'Mon, Apr 2, 4:00 PM',  checkOut: 'Fri, Apr 5, 10:00 AM',  platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP1, cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM', hasManualCleaning: true },
    { id: '10', date: 27, checkIn: 'Mon, Apr 2, 4:00 PM', checkOut: 'Fri, Apr 5, 10:00 AM',  platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP, cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '11', date: 29, checkIn: 'Mon, Apr 2, 4:00 PM', checkOut: 'Fri, Apr 5, 10:00 AM',  platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP1, cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
];

export const LIST_EVENTS: ListEvent[] = [
    { id: '1', checkIn: 'Mon, Apr 2, 4:00 PM', checkOut: 'Fri, Apr 5, 10:00 AM', platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP1, cleaningLabel: 'Scheduled Cleaning', cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '2', checkIn: 'Mon, Apr 2, 4:00 PM', checkOut: 'Fri, Apr 5, 10:00 AM', platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP, cleaningLabel: 'Scheduled Cleaning', cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '3', checkIn: 'Mon, Apr 2, 4:00 PM', checkOut: 'Fri, Apr 5, 10:00 AM', platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP1, cleaningLabel: 'Scheduled Cleaning', cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '4', checkIn: 'Mon, Apr 2, 4:00 PM', checkOut: 'Fri, Apr 5, 10:00 AM', platform: 'booking', cleanerImage: IMAGE_COMPONENTS.cleanerPP, cleaningLabel: 'Scheduled Cleaning', cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '5', checkIn: 'Mon, Apr 2, 4:00 PM', checkOut: 'Fri, Apr 5, 10:00 AM', platform: 'booking', cleanerImage: IMAGE_COMPONENTS.cleanerPP, cleaningLabel: 'Scheduled Cleaning', cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM' },
    { id: '6', checkIn: 'Mon, Apr 2, 4:00 PM', checkOut: 'Fri, Apr 5, 10:00 AM', platform: 'airbnb',  cleanerImage: IMAGE_COMPONENTS.cleanerPP1, cleaningLabel: 'Scheduled Cleaning', cleaningTime: 'Fri. Apr 5, 10:00 AM - 4:00 PM', hasManualCleaning: true },
];

export const PLATFORM_COLORS: Record<PlatformType, string> = {
    airbnb:  '#F64B7C',
    booking: '#4B6DF6',
    vrbo:    '#1A1A2E',
    other:   '#666666',
};

export const PLATFORM_LABELS: Record<PlatformType, string> = {
    airbnb:  'A',
    booking: 'B',
    vrbo:    'V',
    other:   '⊕',
};