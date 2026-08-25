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