import { useFormat } from '@/lib/useFormat';
import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { TodayTaskCard } from '@/components/cleaner/home/TodayTaskCard';
import { UpcomingTaskCard } from '@/components/cleaner/home/UpcomingTaskCard';
import { Body5, Caption1, Caption3, Caption4, Caption5, H2, H3 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';

import { personName, toCleanerTask } from '@/lib/mappers';
import { useCurrentUser } from '@/redux/hooks';
import { useGetCleanerHomeQuery } from '@/redux/services/scheduleApi';
import { CleanerTask } from '@/types/taskStatus';
import { AppImage } from '@/components/shared/AppImage';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function EmptyTask({
    title,
    subtitle,
    note,
}: {
    title: string;
    subtitle: string;
    note: string;
}) {
    return (
        <View style={styles.emptyBox}>
            <AppImage
                source={IMAGE_COMPONENTS.emptyToDo}
                style={styles.emptyImage}
                contentFit="contain"
            />
            <View>
                <Caption1 color="#727272">{title}</Caption1>
                <Caption4 color="#000000">{subtitle}</Caption4>
                <Caption5 color="#727272">{note}</Caption5>
            </View>
        </View>
    );
}

export default function CleanerHomeScreen() {
    const t = useT();
    const { formatDate } = useFormat();
    const router = useRouter();
    const me = useCurrentUser();

    const { data, isLoading, refetch } = useGetCleanerHomeQuery();
    const { refreshing, onRefresh } = useRefresh([refetch]);

    // The backend resolves "today" in this device's timezone (x-timezone), so
    // the header date and the buckets always agree.
    const today = formatDate(data?.summary?.date ?? new Date(), {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const todaysTasks = useMemo(
        () => (data?.todaysCleaning ?? []).map(toCleanerTask),
        [data],
    );
    const upcomingTasks = useMemo(
        () => (data?.upcomingTasks ?? []).map(toCleanerTask),
        [data],
    );

    const handleTaskPress = (item: CleanerTask) => {
        router.push({
            pathname: '/cleaner/task/details',
            params: { taskId: item.id, isUpcoming: item.isUpcoming ? '1' : '0' },
        } as any);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Stats card */}
                <View style={styles.statsCard}>
                    <H3 color={Colors.TEXT_COLOR}>
                        {t("Welcome back, {name}", { name: personName(me, t("Operative")) })}
                    </H3>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <H2 color={Colors.PRIMARY_TEXT}>
                                {data?.summary?.missionsToday ?? 0}
                            </H2>
                            <Caption3 color={Colors.TEXT_COLOR}>{t("MISSIONS TODAY")}</Caption3>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <H2 color={Colors.PRIMARY_TEXT}>
                                {data?.summary?.completedToday ?? 0}
                            </H2>
                            <Caption3 color={Colors.TEXT_COLOR}>{t("COMPLETED")}</Caption3>
                        </View>
                    </View>
                </View>

                {/* Today's Cleaning */}
                <View style={styles.sectionHeader}>
                    <Body5 color={Colors.TEXT_COLOR}>{t("Today's Cleaning")}</Body5>
                    <Caption3 color={Colors.TEXT_COLOR}>{today}</Caption3>
                </View>

                {isLoading ? (
                    <SkeletonList count={2} />
                ) : todaysTasks.length === 0 ? (
                    <View style={styles.emptyWrapper}>
                        <EmptyTask
                            title={t("No task to do")}
                            subtitle={t("You have no pending task")}
                            note="Enjoy your time"
                        />
                    </View>
                ) : (
                    todaysTasks.map((item) => (
                        <TodayTaskCard key={item.id} item={item} onPress={handleTaskPress} />
                    ))
                )}

                {/* Upcoming Tasks */}
                <Body5
                    color={Colors.TEXT_COLOR}
                    style={styles.upcomingTitle}
                >
                    {t("Upcoming Tasks")}
                </Body5>

                {isLoading ? null : upcomingTasks.length === 0 ? (
                    <View style={styles.emptyWrapper}>
                        <EmptyTask
                            title={t("No upcoming task to do")}
                            subtitle={t("You have no Upcoming task")}
                            note="Enjoy your time"
                        />
                    </View>
                ) : (
                    upcomingTasks.map((item) => (
                        <UpcomingTaskCard key={item.id} item={item} onPress={handleTaskPress} />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    scroll: { paddingHorizontal: wp(20), paddingBottom: hp(100) },

    // Stats
    statsCard: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        padding: wp(16),
        marginVertical: hp(16),
        gap: hp(8),
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: { flex: 1, gap: hp(2) },
    statDivider: {
        width: 1,
        height: hp(40),
        backgroundColor: Colors.BORDER_COLOR,
        marginHorizontal: wp(16),
    },

    // Section header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(12),
    },
    upcomingTitle: { marginTop: hp(20), marginBottom: hp(12) },

    // Empty
    emptyWrapper: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        marginBottom: hp(10),
    },
    emptyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(16),
        padding: wp(16),
    },
    emptyImage: { width: wp(70), height: wp(70) },
});