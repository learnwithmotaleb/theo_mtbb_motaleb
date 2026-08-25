import { IMAGE_COMPONENTS } from '@/constants/image.index';

// ── Types ─────────────────────────────────────────────────────────────────────
export type ChatMessage = {
    id: string;
    text: string;
    sender: 'me' | 'other';
    time: string; // "09:58 AM"
};

export type Conversation = {
    id: string;
    name: string;
    image: any;
    lastMessage: string;
    time: string; // "3.10 pm"
    messages: ChatMessage[];
};

// ── HOST conversations (cleaner দের সাথে) ─────────────────────────────────────
export const HOST_CONVERSATIONS: Conversation[] = [
    {
        id: 'cleaner_1',
        name: 'Georgiaa',
        image: IMAGE_COMPONENTS.cleanerPP,
        lastMessage: 'Whatttsupppp',
        time: '3.10 pm',
        messages: [
            { id: '1', sender: 'me',    time: '09:58 AM', text: 'Hi Georgiaa, apartment 4B has a guest checkout tomorrow at 11:00 AM. Can you take the cleaning task?' },
            { id: '2', sender: 'other', time: '09:59 AM', text: 'Hi! Yes, I\'m available. What time should I arrive?' },
            { id: '3', sender: 'me',    time: '10:00 AM', text: 'Please arrive around 11:30 AM. The next guest checks in at 3:00 PM.' },
            { id: '4', sender: 'other', time: '10:01 AM', text: 'Perfect. I\'ll start right after checkout and finish before 2:00 PM.' },
            { id: '5', sender: 'me',    time: '10:02 AM', text: 'Great. Please make sure to:\n• change bed linens\n• refill bathroom supplies\n• upload final photos after cleaning' },
            { id: '6', sender: 'other', time: '10:03 AM', text: 'Got it 👍 I\'ll send photos once everything is completed.' },
            { id: '7', sender: 'other', time: '11:42 AM', text: 'I\'ve arrived at the apartment and started cleaning.' },
            { id: '8', sender: 'me',    time: '11:43 AM', text: 'Thanks for the update!' },
        ],
    },
    {
        id: 'cleaner_2',
        name: 'Cyra',
        image: IMAGE_COMPONENTS.cleanerPP1,
        lastMessage: 'its urgentt do it asap',
        time: '3.10 pm',
        messages: [
            { id: '1', sender: 'other', time: '02:00 PM', text: 'Hey, are you available for a cleaning tomorrow?' },
            { id: '2', sender: 'me',    time: '02:05 PM', text: 'Yes I am. What time?' },
            { id: '3', sender: 'other', time: '02:06 PM', text: 'its urgentt do it asap' },
        ],
    },
    {
        id: 'cleaner_3',
        name: 'Kiara',
        image: IMAGE_COMPONENTS.cleanerPP1,
        lastMessage: 'your most wlcm',
        time: '3.10 pm',
        messages: [
            { id: '1', sender: 'me',    time: '01:00 PM', text: 'Thank you so much for the great job yesterday!' },
            { id: '2', sender: 'other', time: '01:10 PM', text: 'your most wlcm' },
        ],
    },
    {
        id: 'cleaner_4',
        name: 'Cyra',
        image: IMAGE_COMPONENTS.cleanerPP,
        lastMessage: 'we can try itt......',
        time: '3.10 pm',
        messages: [
            { id: '1', sender: 'me',    time: '12:00 PM', text: 'Can you handle the Paris 13 apartment this weekend?' },
            { id: '2', sender: 'other', time: '12:15 PM', text: 'we can try itt......' },
        ],
    },
    {
        id: 'cleaner_5',
        name: 'cyron',
        image: IMAGE_COMPONENTS.cleanerPP1,
        lastMessage: 'its amazing bruhhh..',
        time: '3.10 pm',
        messages: [
            { id: '1', sender: 'other', time: '11:00 AM', text: 'Just finished the deep clean. Everything looks perfect!' },
            { id: '2', sender: 'me',    time: '11:05 AM', text: 'Wow, the photos look great!' },
            { id: '3', sender: 'other', time: '11:06 AM', text: 'its amazing bruhhh..' },
        ],
    },
];

// ── CLEANER conversations (host দের সাথে) ─────────────────────────────────────
export const CLEANER_CONVERSATIONS: Conversation[] = [
    {
        id: 'host_1',
        name: 'Hridoy',
        image: IMAGE_COMPONENTS.hostProfile,
        lastMessage: 'Thanks for the update!',
        time: '3.10 pm',
        messages: [
            { id: '1', sender: 'other', time: '09:58 AM', text: 'Hi, apartment 4B has a guest checkout tomorrow at 11:00 AM. Can you take the cleaning task?' },
            { id: '2', sender: 'me',    time: '09:59 AM', text: 'Hi! Yes, I\'m available. What time should I arrive?' },
            { id: '3', sender: 'other', time: '10:00 AM', text: 'Please arrive around 11:30 AM. The next guest checks in at 3:00 PM.' },
            { id: '4', sender: 'me',    time: '10:01 AM', text: 'Perfect. I\'ll start right after checkout and finish before 2:00 PM.' },
            { id: '5', sender: 'me',    time: '11:42 AM', text: 'I\'ve arrived at the apartment and started cleaning.' },
            { id: '6', sender: 'other', time: '11:43 AM', text: 'Thanks for the update!' },
        ],
    },
    {
        id: 'host_2',
        name: 'Thomas',
        image: IMAGE_COMPONENTS.hostPP,
        lastMessage: 'See you tomorrow!',
        time: '2.45 pm',
        messages: [
            { id: '1', sender: 'other', time: '01:00 PM', text: 'Can you come for the Paris 11 apartment on Friday?' },
            { id: '2', sender: 'me',    time: '01:10 PM', text: 'Yes, I\'ll be there at 10am.' },
            { id: '3', sender: 'other', time: '01:11 PM', text: 'See you tomorrow!' },
        ],
    },
    {
        id: 'host_3',
        name: 'Marie',
        image: IMAGE_COMPONENTS.hostPP1,
        lastMessage: 'Perfect, thank you!',
        time: '1.30 pm',
        messages: [
            { id: '1', sender: 'me',    time: '11:00 AM', text: 'Just finished cleaning the studio. Photos uploaded!' },
            { id: '2', sender: 'other', time: '11:15 AM', text: 'Perfect, thank you!' },
        ],
    },
];