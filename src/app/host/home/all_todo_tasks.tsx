import { ToDoCard } from '@/components/host/home/ToDoCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { Task } from '@/data/hostFakeData';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

// ── Fake data — date grouped ───────────────────────────────────────────────────
const ALL_TODO_GROUPS: { date: string; tasks: Task[] }[] = [
    {
        date: 'Today',
        tasks: [
            {
                id: '1',
                status: 'refused',
                statusLabel: 'Refused the mission.',
                apartmentName: 'Appartement T3 – City Center',
                timeAgo: '2 Hours ago',
                cleanerName: 'Sophie',
                cleanerImage: IMAGE_COMPONENTS.cleanerPP,
                apartmentImage: IMAGE_COMPONENTS.apartment7,
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
                apartmentImage: IMAGE_COMPONENTS.apartment6,
                address: '12 Rue de Charenton 75012 Paris, France',
                date: 'Wednesday, may 22, 2026',
                checkOut: '10:00am',
                checkIn: '12:30pm',
                price: 55,
                serviceFee: 3,
            },
        ],
    },
    {
        date: '10 October',
        tasks: [
            {
                id: '3',
                status: 'refused',
                statusLabel: 'Refused the mission.',
                apartmentName: 'Appartement T3 – City Center',
                timeAgo: '2 weeks ago',
                cleanerName: 'Sophie',
                cleanerImage: IMAGE_COMPONENTS.cleanerPP1,
                apartmentImage: IMAGE_COMPONENTS.apartment5,
                address: '12 Rue de Charenton 75012 Paris, France',
                date: '10 October',
                checkOut: '10:00am',
                checkIn: '12:30pm',
                price: 55,
                serviceFee: 3,
            },
            {
                id: '4',
                status: 'completed',
                statusLabel: 'Cleaning Completed',
                apartmentName: 'Appartement T3 – City Center',
                timeAgo: '2 weeks ago',
                cleanerName: 'Sophie',
                cleanerImage: IMAGE_COMPONENTS.cleanerPP1,
                apartmentImage: IMAGE_COMPONENTS.apartment4,
                address: '12 Rue de Charenton 75012 Paris, France',
                date: '10 October',
                checkOut: '10:00am',
                checkIn: '12:30pm',
                price: 55,
                serviceFee: 3,
            },
            {
                id: '5',
                status: 'pending_accept',
                statusLabel: 'Accept your request',
                apartmentName: 'Appartement T3 – City Center',
                timeAgo: '2 weeks ago',
                cleanerName: 'Sophie',
                cleanerImage: IMAGE_COMPONENTS.cleanerPP,
                apartmentImage: IMAGE_COMPONENTS.apartment3,
                address: '12 Rue de Charenton 75012 Paris, France',
                date: '10 October',
                checkOut: '10:00am',
                checkIn: '12:30pm',
                price: 55,
                serviceFee: 3,
            },
        ],
    },
];

export default function AllToDoTasksScreen() {
    const router = useRouter();

    const handleTaskPress = (item: Task) => {
        router.push({
            pathname: '/host/home/task_status',
            params: { taskId: item.id },
        } as any);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="To Do" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {ALL_TODO_GROUPS.map((group) => (
                    <View key={group.date}>
                        {/* Date header */}
                        <Caption1
                            color={Colors.TEXT_COLOR}
                            style={styles.dateHeader}
                        >
                            {group.date}
                        </Caption1>

                        {/* Task cards */}
                        {group.tasks.map((task) => (
                            <View key={task.id} style={styles.cardWrap}>
                                <ToDoCard item={task} onPress={handleTaskPress} />
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: {
        paddingBottom: hp(40),
    },
    dateHeader: {
        fontFamily: 'Poppins_700Bold',
        marginTop: hp(20),
        marginBottom: hp(12),
    },
    cardWrap: {
        marginBottom: hp(12),
    },
});