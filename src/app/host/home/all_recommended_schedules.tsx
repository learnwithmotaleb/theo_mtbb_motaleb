import { RecommendedScheduleCard } from '@/components/host/home/RecommendedScheduleCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { RecommendedSchedule } from '@/data/hostFakeData';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

// ── Fake data — date grouped ───────────────────────────────────────────────────
const ALL_SCHEDULES: { date: string; items: RecommendedSchedule[] }[] = [
    {
        date: '10 September',
        items: [
            {
                id: '1',
                apartmentName: 'Appartement T3 – City Center',
                idealDate: '10 September',
                timeSlot: '10:00pm – 12:30am',
                cleanerName: 'Sophie',
                cleanerImage: IMAGE_COMPONENTS.cleanerPP,
                apartmentImage: IMAGE_COMPONENTS.apartment1,
            },
            {
                id: '2',
                apartmentName: 'Appartement T3 – City Center',
                idealDate: '10 September',
                timeSlot: '10:00pm – 12:30am',
                cleanerName: 'Sophie',
                cleanerImage: IMAGE_COMPONENTS.cleanerPP1,
                apartmentImage: IMAGE_COMPONENTS.apartment,
            },
        ],
    },
    {
        date: '10 October',
        items: [
            {
                id: '3',
                apartmentName: 'Appartement T3 – City Center',
                idealDate: '10 October',
                timeSlot: '10:00pm – 12:30am',
                cleanerName: 'Sophie',
                cleanerImage: IMAGE_COMPONENTS.cleanerPP1,
                apartmentImage: IMAGE_COMPONENTS.apartment2,
            },
            {
                id: '4',
                apartmentName: 'Appartement T3 – City Center',
                idealDate: '10 October',
                timeSlot: '10:00pm – 12:30am',
                cleanerName: 'Sophie',
                cleanerImage: IMAGE_COMPONENTS.cleanerPP,
                apartmentImage: IMAGE_COMPONENTS.apartment3,
            },
            {
                id: '5',
                apartmentName: 'Appartement T3 – City Center',
                idealDate: '10 October',
                timeSlot: '10:00pm – 12:30am',
                cleanerName: 'Sophie',
                cleanerImage: IMAGE_COMPONENTS.cleanerPP1,
                apartmentImage: IMAGE_COMPONENTS.apartment4,
            },
        ],
    },
    {
        date: '10 November',
        items: [
            {
                id: '6',
                apartmentName: 'Appartement T3 – City Center',
                idealDate: '10 November',
                timeSlot: '10:00pm – 12:30am',
                cleanerName: 'Sophie',
                cleanerImage: IMAGE_COMPONENTS.cleanerPP,
                apartmentImage: IMAGE_COMPONENTS.apartment5,
            },
        ],
    },
];

export default function AllRecommendedSchedulesScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Recommended Schedule" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {ALL_SCHEDULES.map((group) => (
                    <View key={group.date}>
                        {/* Date header */}
                        <Caption1
                            color={Colors.TEXT_COLOR}
                            style={styles.dateHeader}
                        >
                            {group.date}
                        </Caption1>

                        {/* Cards */}
                        {group.items.map((item) => (
                            <View key={item.id} style={styles.cardWrap}>
                                <RecommendedScheduleCard
                                    data={item}
                                    onPress={() =>
                                        router.push('/host/home/recommended_cleaning' as any)
                                    }
                                />
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