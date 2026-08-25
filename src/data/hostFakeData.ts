import { IMAGE_COMPONENTS } from '@/constants/image.index';
import {
    Accommodation,

    Housekeeper,
} from '@/types/dataTypes';
import { AccommodationDetail, HousingItem, ManageCleanersData, TaskStatusScreenData } from '@/types/taskStatus';

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

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

export const RECOMMENDED_SCHEDULE: RecommendedSchedule | null = {
    id: '1',
    apartmentName: 'Appartement T3 – City Center',
    idealDate: '10 September',
    timeSlot: '10:00pm – 12:30am',
    cleanerName: 'Sophie',
    cleanerImage: IMAGE_COMPONENTS.cleanerPP,
    apartmentImage: IMAGE_COMPONENTS.apartment,
};
// null করলে empty state দেখাবে:
// export const RECOMMENDED_SCHEDULE: RecommendedSchedule | null = null;

export const TODO_TASKS: Task[] = [
    {
        id: '1',
        status: 'refused',
        statusLabel: 'Refused the mission.',
        apartmentName: 'Appartement T3 – City Center',
        timeAgo: '2 Hours ago',
        cleanerName: 'Sophie',
        cleanerImage: IMAGE_COMPONENTS.cleanerPP,
        apartmentImage: IMAGE_COMPONENTS.apartment,
        address: '12 Rue de Charenton 75012 Paris, France',
        date: 'Wednesday, may 22, 2026',
        checkOut: '10:00am',
        checkIn: '12:30pm',
        price: 55,
        serviceFee: 3,
    },
    {
        id: '2',
        status: 'refused',
        statusLabel: 'Refused the mission.',
        apartmentName: 'Appartement T9 – Paris 13',
        timeAgo: '2 Hours ago',
        cleanerName: 'Sophie',
        cleanerImage: IMAGE_COMPONENTS.cleanerPP1,
        apartmentImage: IMAGE_COMPONENTS.apartment1,
        address: '12 Rue de Charenton 75012 Paris, France',
        date: 'Wednesday, may 22, 2026',
        checkOut: '10:00am',
        checkIn: '12:30pm',
        price: 55,
        serviceFee: 3,
    },
    {
        id: '3',
        status: 'completed',
        statusLabel: 'Cleaning Completed',
        apartmentName: 'Appartement T9 – Paris 13',
        timeAgo: '2 Hours ago',
        cleanerName: 'Sophie',
        cleanerImage: IMAGE_COMPONENTS.cleanerPP,
        apartmentImage: IMAGE_COMPONENTS.apartment2,
        address: '12 Rue de Charenton 75012 Paris, France',
        date: 'Wednesday, may 22, 2026',
        checkOut: '10:00am',
        checkIn: '12:30pm',
        price: 55,
        serviceFee: 3,
    },
    {
        id: '4',
        status: 'pending_accept',
        statusLabel: 'Accept your request',
        apartmentName: 'Appartement T9 – Paris 13',
        timeAgo: '2 Hours ago',
        cleanerName: 'Sophie',
        cleanerImage: IMAGE_COMPONENTS.cleanerPP1,
        apartmentImage: IMAGE_COMPONENTS.apartment3,
        address: '12 Rue de Charenton 75012 Paris, France',
        date: 'Wednesday, may 22, 2026',
        checkOut: '10:00am',
        checkIn: '12:30pm',
        price: 55,
        serviceFee: 3,
    },
    {
        id: '5',
        status: 'report_problem',
        statusLabel: 'Report a problem',
        apartmentName: 'Appartement T3 – City Center',
        timeAgo: '2 Hours ago',
        cleanerName: 'Sophie',
        cleanerImage: IMAGE_COMPONENTS.cleanerPP,
        apartmentImage: IMAGE_COMPONENTS.apartment4,
        address: '12 Rue de Charenton 75012 Paris, France',
        date: 'Wednesday, may 22, 2026',
        checkOut: '10:00am',
        checkIn: '12:30pm',
        price: 55,
        serviceFee: 3,
    },
];
// empty করলে empty state দেখাবে:
// export const TODO_TASKS: Task[] = [];

export const TASK_STATUS_DATA: TaskStatusScreenData = {
    refused: {
        cleanerName: 'Claire',
        cleanerImage: IMAGE_COMPONENTS.cleanerPP,
        cleanerLocation: 'Paris 11e',
        apartmentName: 'Appartement T3 – City Center',
        apartmentImage: IMAGE_COMPONENTS.apartment5,
        location: 'Paris 11e',
        idealSlot: '10:00 AM – 4:00 PM',
        timeSlot: '10:00 – 16:00',
        noHousekeeperAvailable: false,
        nearestHousekeepers: [
            { id: '1', name: 'Sophie', location: 'Paris 11e', image: IMAGE_COMPONENTS.cleanerPP },
            { id: '2', name: 'Sophie', location: 'Paris 11e', image: IMAGE_COMPONENTS.cleanerPP1 },
            { id: '3', name: 'Sophie', location: 'Paris 11e', image: IMAGE_COMPONENTS.cleanerPP1 },
        ],
    },
    completed: {
        apartmentName: 'Appartement T3 – City Center',
        apartmentImage: IMAGE_COMPONENTS.apartment6,
        date: 'Thursday, June 12',
        time: '10:00 – 16:00',
        cleanerName: 'Sophie',
        cleanerImage: IMAGE_COMPONENTS.cleanerPP1,
        photos: [IMAGE_COMPONENTS.apartment7],
        notes: 'Everything went well, the apartment was clean and tidy.',
    },
    report_problem: {
        cleanerName: 'Sophie',
        cleanerImage: IMAGE_COMPONENTS.cleanerPP,
        cleanerLocation: 'Paris 11e',
        reportedAt: 'June 12 at 10:30 AM',
        message: 'I found a broken glass in the living room and stains on the sofa. I have taken photos.',
        photos: [IMAGE_COMPONENTS.apartment1, IMAGE_COMPONENTS.apartment6],
        ligament: 'Appartement T3 – City Center',
        apartmentName: 'Appartement T3 – City Center',
        dateAndHouse: 'Thursday, June 12 • 10:00 AM – 12:30 PM',
    },
    pending_accept: {
        cleanerName: 'Claire',
        cleanerImage: IMAGE_COMPONENTS.cleanerPP1,
        apartmentName: 'Appartement T3 – City Center',
        apartmentImage: IMAGE_COMPONENTS.apartment4,
        apartmentLocation: 'Paris',
        apartmentCountry: 'France',
    },
};

export const CLEANING_DETAIL = {
    apartmentName: 'Apartment T3 – City Center',
    address: '12 Rue de Charenton\n75012 Paris, France',
    addressOneLine: '12 Rue de Charenton 75012 Paris, France',
    date: 'Wednesday, may 22, 2026',
    checkOut: '10:00am',
    checkIn: '12:30pm',
    housekeeper: 'Sophie',
    cleaningService: 55,
    serviceFee: 3,
    apartmentImage: IMAGE_COMPONENTS.apartment1,
    cleaner: {
        name: 'Sophie',
        completedCleanings: 32,
        image: IMAGE_COMPONENTS.cleanerPP1,
    },
};

export const ACCOMMODATIONS: Accommodation[] = [
    {
        id: '1',
        name: 'Appartement T3 – City Center',
        location: 'Paris 12e',
        price: '52,50 €',
        image: IMAGE_COMPONENTS.apartment3,
        cleaner: {
            name: 'Sophie',
            image: IMAGE_COMPONENTS.cleanerPP,
            since: 'Since March 2024',
        },
    },
    {
        id: '2',
        name: 'Appartement T3 – City Center',
        location: 'Paris 12e',
        price: '52,50 €',
        image: IMAGE_COMPONENTS.apartment6,
    },
    {
        id: '3',
        name: 'Appartement T3 – City Center',
        location: 'Paris 12e',
        price: '52,50 €',
        image: IMAGE_COMPONENTS.apartment1,
    },
    {
        id: '4',
        name: 'Appartement T3 – City Center',
        location: 'Paris 12e',
        price: '52,50 €',
        image: IMAGE_COMPONENTS.apartment5,
    },
    {
        id: '5',
        name: 'Appartement T3 – City Center',
        location: 'Paris 12e',
        price: '52,50 €',
        image: IMAGE_COMPONENTS.apartment3,
    },
];

export const HOUSEKEEPERS: Housekeeper[] = [
    {
        id: '1',
        name: 'Sophie',
        role: 'Housekeeper',
        location: 'Paris 11th and surroundings',
        interventionZone: 'Paris 11th and surroundings',
        appExperience: '45 cleanings completed',
        memberSince: 'March 2024',
        about: 'Hello! I am Léa, a professional housekeeper with several years of experience. Serious, discreet, and organized, I attach great importance to the quality of work and your satisfaction. I can take care of the complete maintenance of your home: cleaning, ironing, tidying... Do not hesitate to contact me, I will be happy to help you!',
        services: [
            'Complete home maintenance',
            'Ironing of laundry',
            'Tidying and organization',
            'Window cleaning',
            'Complete home maintenance',
            'Complete home maintenance',
            'Complete home maintenance',
        ],
        languages: ['Français / French'],
        image: IMAGE_COMPONENTS.cleanerPP1,
        cleaningsCompleted: 45,
    },
    {
        id: '2',
        name: 'Sophie',
        role: 'Housekeeper',
        location: 'Paris 11th and surroundings',
        interventionZone: 'Paris 11th and surroundings',
        appExperience: '45 cleanings completed',
        memberSince: 'March 2024',
        about: 'Hello! I am Léa, a professional housekeeper with several years of experience. Serious, discreet, and organized, I attach great importance to the quality of work and your satisfaction.',
        services: [
            'Complete home maintenance',
            'Ironing of laundry',
            'Tidying and organization',
        ],
        languages: ['Français / French'],
        image: IMAGE_COMPONENTS.cleanerPP,
        cleaningsCompleted: 45,
    },
];

export const HOUSING_LIST: HousingItem[] = [
    {
        id: '1',
        name: 'Appartement T3 – City Center',
        location: 'Paris 12e',
        image: IMAGE_COMPONENTS.apartment,
        cleaners: [
            { id: '1', name: 'Sophie', image: IMAGE_COMPONENTS.cleanerPP1 },
            { id: '2', name: 'Fatou', image: IMAGE_COMPONENTS.cleanerPP },
        ],
    },
    {
        id: '2',
        name: 'Appartement T3 – City Center',
        location: 'Paris 12e',
        image: IMAGE_COMPONENTS.apartment2,
        cleaners: [
            { id: '1', name: 'Sophie', image: IMAGE_COMPONENTS.cleanerPP1 },
            { id: '2', name: 'Fatou', image: IMAGE_COMPONENTS.cleanerPP },
        ],
    },
    {
        id: '3',
        name: 'Appartement T3 – City Center',
        location: 'Paris 12e',
        image: IMAGE_COMPONENTS.apartment6,
        cleaners: [
            { id: '1', name: 'Sophie', image: IMAGE_COMPONENTS.cleanerPP },
            { id: '2', name: 'Fatou', image: IMAGE_COMPONENTS.cleanerPP1 },
        ],
    },
    {
        id: '4',
        name: 'Appartement T3 – City Center',
        location: 'Paris 12e',
        image: IMAGE_COMPONENTS.apartment7,
        cleaners: [], // No Cleaner Assigned
    },
];

export const ACCOMMODATION_DETAIL: AccommodationDetail = {
    id: '1',
    name: 'Apartment T3 – City Center',
    address: '12 Rue de Charenton 75012 Paris, France',
    image: IMAGE_COMPONENTS.apartment1,
    accommodationType: 'Apartment',
    bedrooms: '2 Bedrooms',
    surface: '65m²',
    floor: '3rd Floor',
    elevator: 'Yes',
    cleaner: {
        name: 'Sophie',
        image: IMAGE_COMPONENTS.cleanerPP,
        cleaningsCompleted: 32,
    },
    // cleaner নেই হলে: cleaner: null,
    cleaningRate: '55,00 €',
    practical: {
        keyBox: 'Yes',
        keyBoxCode: '2154',
        specificInstruction:
            'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here,',
    },
};

export const MANAGE_CLEANERS_DATA: ManageCleanersData = {
    accommodation: {
        name: 'Apartment T3 – City Center',
        address: '12 Rue de Charenton\n75012 Paris, France',
        image: IMAGE_COMPONENTS.apartment4,
    },
    primaryCleaner: {
        id: '1',
        name: 'Sophie',
        image: IMAGE_COMPONENTS.cleanerPP1,
        cleaningsCompleted: 32,
        isPrimary: true,
    },
    substitutes: [
        { id: '2', name: 'Sophie', image: IMAGE_COMPONENTS.cleanerPP1, cleaningsCompleted: 32 },
        { id: '3', name: 'Sophie', image: IMAGE_COMPONENTS.cleanerPP, cleaningsCompleted: 32 },
    ],
};