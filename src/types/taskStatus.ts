// ── Task Status ───────────────────────────────────────────────────────────────
export type TaskStatusScreenData = {
    refused: {
        cleanerName: string;
        cleanerImage: any;
        cleanerLocation: string;
        apartmentName: string;
        apartmentImage: any;
        location: string;
        idealSlot: string;
        timeSlot: string;
        nearestHousekeepers: {
            id: string;
            name: string;
            location: string;
            image: any;
        }[];
        noHousekeeperAvailable: boolean;
    };
    completed: {
        apartmentName: string;
        apartmentImage: any;
        date: string;
        time: string;
        cleanerName: string;
        cleanerImage: any;
        photos: any[];
        notes: string;
    };
    report_problem: {
        cleanerName: string;
        cleanerImage: any;
        cleanerLocation: string;
        reportedAt: string;
        message: string;
        photos: any[];
        ligament: string;
        apartmentName: string;
        dateAndHouse: string;
    };
    pending_accept: {
        cleanerName: string;
        cleanerImage: any;
        apartmentName: string;
        apartmentImage: any;
        apartmentLocation: string;
        apartmentCountry: string;
    };
};

export type Cleaner = {
    id: string;
    name: string;
    image: any;
};

export type HousingItem = {
    id: string;
    name: string;
    location: string;
    image: any;
    cleaners: Cleaner[];
};

// ── Accommodation ─────────────────────────────────────────────────────────────
export type AccommodationCleaner = {
    name: string;
    image: any;
    cleaningsCompleted: number;
} | null;

export type AccommodationDetail = {
    id: string;
    name: string;
    address: string;
    image: any;
    accommodationType: string;
    bedrooms: string;
    surface: string;
    floor: string;
    elevator: string;
    cleaner: AccommodationCleaner;
    cleaningRate: string;
    practical: {
        keyBox: string;
        keyBoxCode: string;
        specificInstruction: string;
    };
};

// ── Housekeeper ───────────────────────────────────────────────────────────────
export type Housekeeper = {
    id: string;
    name: string;
    role: string;
    location: string;
    interventionZone: string;
    appExperience: string;
    memberSince: string;
    about: string;
    services: string[];
    languages: string[];
    image: any;
    cleaningsCompleted: number;
};

// ── Accommodation (for selection list) ────────────────────────────────────────
export type Accommodation = {
    id: string;
    name: string;
    location: string;
    price: string;
    image: any;
    cleaner?: {
        name: string;
        image: any;
        since: string;
    };
};

// ── Manage Cleaners ───────────────────────────────────────────────────────────
export type ManageCleanerItem = {
    id: string;
    name: string;
    image: any;
    cleaningsCompleted: number;
    isPrimary?: boolean;
};

export type ManageCleanersData = {
    accommodation: {
        name: string;
        address: string;
        image: any;
    };
    primaryCleaner: ManageCleanerItem;
    substitutes: ManageCleanerItem[];
};


export type CleanerTask = {
    id: string;
    apartmentName: string;
    address: string;
    date: string;
    time: string;
    image: any;
    isPrincipal: boolean;
    isUpcoming: boolean;
    // Details page data
    type: string;
    surface: string;
    floor: string;
    rooms: string;
    bathrooms: string;
    access: string;
    cleaningRate: string;
    keyBox: string;
    keyBoxCode: string;
    specificInstruction: string;
    client: {
        name: string;
        phone: string;
        image: any;
    };
};



export type CleaningRequest = {
    id: string;
    apartmentName: string;
    address: string;
    pricePerCleaning: string;
    description: string;
    image: any;
    // Team page data
    status: 'active' | 'inactive';
    location: string;
    cleaningsCompleted: number;
    type: string;
    surface: string;
    floor: string;
    rooms: string;
    bathrooms: string;
    access: string;
    cleaningRate: string;
    keyBox: string;
    keyBoxCode: string;
    specificInstruction: string;
    client: {
        name: string;
        phone: string;
        image: any;
    };
};



export type ConnectionRequest = {
    id: string;
    name: string;
    role: string;
    location: string;
    image: any;
    propertiesCount: number;
    city: string;
    memberSince: string;
    properties: {
        id: string;
        name: string;
        location: string;
        image: any;
        accommodationType: string;
        bedrooms: string;
        surface: string;
        floor: string;
        elevator: string;
        cleaningRate: string;
    }[];
};


