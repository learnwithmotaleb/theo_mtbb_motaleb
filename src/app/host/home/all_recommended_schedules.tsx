import { useFormat } from '@/lib/useFormat';
import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { RecommendedScheduleCard } from '@/components/host/home/RecommendedScheduleCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';

import { ApiRecommendation, toRecommendedSchedule } from '@/lib/mappers';
import { useGetRecommendedSchedulesQuery } from '@/redux/services/accommodationApi';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function AllRecommendedSchedulesScreen() {
    const t = useT();
    const { formatDate } = useFormat();
    const router = useRouter();

    const { data, isLoading, refetch } = useGetRecommendedSchedulesQuery({
        page: 1,
        limit: 50,
    });
    const { refreshing, onRefresh } = useRefresh([refetch]);

    // The backend returns a flat, date-sorted list; the screen groups it by day.
    const groups = useMemo(() => {
        const rows = (data?.data ?? []) as ApiRecommendation[];
        const byDate = new Map<string, ApiRecommendation[]>();

        rows.forEach((row) => {
            const label = formatDate(row.recommendedDate, {
                day: 'numeric',
                month: 'long',
            });
            if (!byDate.has(label)) byDate.set(label, []);
            byDate.get(label)!.push(row);
        });

        return Array.from(byDate, ([date, items]) => ({ date, items }));
    }, [data]);

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t("Recommended Schedule")} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {isLoading && (
                    <SkeletonList count={3} />
                )}

                {!isLoading && groups.length === 0 && (
                    <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(30) }}>
                        {t("Nothing to schedule — every upcoming turnover is covered.")}
                    </Caption3>
                )}

                {groups.map((group) => (
                    <View key={group.date}>
                        {/* Date header */}
                        <Caption1 color={Colors.TEXT_COLOR} style={styles.dateHeader}>
                            {group.date}
                        </Caption1>

                        {/* Cards */}
                        {group.items.map((item, index) => (
                            <View
                                key={`${item.accommodation._id}-${item.recommendedDate}-${index}`}
                                style={styles.cardWrap}
                            >
                                <RecommendedScheduleCard
                                    data={toRecommendedSchedule(item)}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/host/home/recommended_cleaning',
                                            params: {
                                                accommodationId: item.accommodation._id,
                                                date: item.recommendedDate,
                                                checkInTime: item.checkInTime ?? '',
                                                checkOutTime: item.checkOutTime ?? '',
                                                cleanerId: item.cleaner?._id ?? '',
                                            },
                                        } as any)
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
