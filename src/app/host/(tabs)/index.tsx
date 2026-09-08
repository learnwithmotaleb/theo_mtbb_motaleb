import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { Body2, Body6, Caption1, Caption3, Caption4, Caption5, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';

import { QuickAccess } from '@/components/host/home/QuickAccess';
import { RecommendedScheduleCard } from '@/components/host/home/RecommendedScheduleCard';
import { ToDoCard } from '@/components/host/home/ToDoCard';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Task } from '@/types/hostTypes';
import { useRefresh } from '@/hooks/useRefresh';
import {
    ApiRecommendation,
    ApiTodoEvent,
    toRecommendedSchedule,
    toTodoTask,
} from '@/lib/mappers';
import { useGetHostDashboardQuery } from '@/redux/services/accommodationApi';
import { AppImage } from '@/components/shared/AppImage';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

// ── Empty states ──────────────────────────────────────────────────────────────
function EmptySchedule() {
    const t = useT();
    return (
        <View style={styles.emptyBox}>
            <AppImage
                source={IMAGE_COMPONENTS.recomendedEmpty}
                style={styles.emptyImage}
                contentFit="contain"
            />
            <View>
                <Caption1 color={"#727272"}>{t("No Recommended cleaning")}</Caption1>
                <Caption4 color={"#000000"}>{t("You are up to date! All your upcomming")}</Caption4>
                <Caption5 color={"#727272"}>{t("Cleanings are scheduled")}</Caption5>
            </View>
        </View>
    );
}

function EmptyToDo() {
    const t = useT();
    return (
        <View style={styles.emptyBox}>
            <AppImage
                source={IMAGE_COMPONENTS.emptyToDo}
                style={styles.emptyImage}
                contentFit="contain"
            />
            <View>
                <Caption1 color={"#727272"}>{t("No task to do")}</Caption1>
                <Caption4 color={"#000000"}>{t("You have no pending task")}</Caption4>
                <Caption5 color={"#727272"}>{t("Enjoy your time")}</Caption5>
            </View>
        </View>
    );
}

function ViewAllButton({ onPress }: { onPress: () => void }) {
    const t = useT();
    return (
        <Pressable style={styles.viewAllBtn} onPress={onPress}>
            <Caption3 style={{ textAlign: "center" }} color={Colors.TEXT_COLOR}>{t("View All")}</Caption3>
        </Pressable>
    );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function HostHomeScreen() {
    const t = useT();
    const router = useRouter();

    // One request feeds both sections: the recommended turnovers derived from
    // the connected iCal feeds, and the activity the cleaners generated.
    const { data, isLoading, refetch } = useGetHostDashboardQuery({ page: 1, limit: 20 });
    const { refreshing, onRefresh } = useRefresh([refetch]);

    const recommendations = useMemo(
        () => (data?.recommended_schedule ?? []) as ApiRecommendation[],
        [data],
    );
    const topRecommendation = recommendations[0];

    const todoEvents = useMemo(
        () => (data?.to_do?.data ?? []) as ApiTodoEvent[],
        [data],
    );
    const todoTasks = useMemo(() => todoEvents.map(toTodoTask), [todoEvents]);
    const visibleTasks = todoTasks.slice(0, 2);

    const handleTaskPress = (item: Task) => {
        const source = todoEvents.find(
            (event) => (event.scheduleId ?? event.assignmentId) === item.id,
        );
        router.push({
            pathname: '/host/home/task_status',
            params: {
                taskId: item.id,
                kind: source?.kind ?? 'schedule',
                status: item.status,
            },
        } as any);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <H2 color={Colors.PRIMARY_TEXT} style={styles.pageTitle}>{t("Home")}</H2>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* ── Recommended Schedule ── */}
                <Body2 color={Colors.PRIMARY_TEXT}>{t("Recommended Schedule")}</Body2>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.sectionSub}>
                    {t("Check the details and validate to launch the mission.")}
                </Caption3>

                {isLoading ? (
                    <SkeletonList count={2} />
                ) : topRecommendation ? (
                    <RecommendedScheduleCard
                        data={toRecommendedSchedule(topRecommendation)}
                        onPress={() =>
                            router.push({
                                pathname: '/host/home/recommended_cleaning',
                                params: {
                                    accommodationId: topRecommendation.accommodation._id,
                                    date: topRecommendation.recommendedDate,
                                    checkInTime: topRecommendation.checkInTime ?? '',
                                    checkOutTime: topRecommendation.checkOutTime ?? '',
                                    cleanerId: topRecommendation.cleaner?._id ?? '',
                                },
                            } as any)
                        }
                    />
                ) : (
                    <EmptySchedule />
                )}

                {/* "View All" only once there is more than the one shown here */}
                {(data?.recommended_total ?? 0) > 1 && (
                    <ViewAllButton
                        onPress={() =>
                            router.push('/host/home/all_recommended_schedules' as any)
                        }
                    />
                )}

                {/* ── To do ── */}
                <Body2 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
                    {t("To do")}
                </Body2>
                <Body6 color={Colors.TEXT_COLOR} style={styles.sectionSub}>
                    {t("Find your current tasks and requests here")}
                </Body6>

                {isLoading ? (
                    <SkeletonList count={2} />
                ) : todoTasks.length === 0 ? (
                    <EmptyToDo />
                ) : (
                    <FlatList
                        data={visibleTasks}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ToDoCard item={item} onPress={handleTaskPress} />
                        )}
                        scrollEnabled={false}
                        contentContainerStyle={styles.todoList}
                    />
                )}

                {(data?.to_do?.meta?.total ?? 0) > 2 && (
                    <ViewAllButton
                        onPress={() =>
                            router.push('/host/home/all_todo_tasks' as any)
                        }
                    />
                )}

                {/* ── Quick access ── */}
                <Body2 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
                    {t("Quick access")}
                </Body2>
                <QuickAccess
                    onSchedule={() => router.push('/host/home/accommodation' as any)}
                    onAddHousekeeper={() => router.push('/host/home/add_houskeeper')}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
        paddingTop: hp(30)
    },
    scroll: {
        paddingBottom: hp(80)
    },
    pageTitle: {
        marginBottom: hp(16)
    },
    sectionTitle: { marginTop: hp(24), marginBottom: hp(4) },
    sectionSub: { marginBottom: hp(12) },
    todoList: { gap: hp(12) },
    loader: { paddingVertical: hp(30) },
    emptyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(16),
        paddingVertical: hp(20),
    },
    viewAllBtn: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        marginTop: hp(10),
        borderRadius: wp(8),
        padding: hp(12)
    },
    emptyImage: { width: wp(80), height: wp(80) },
});
