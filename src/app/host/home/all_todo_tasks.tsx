import { useFormat } from '@/lib/useFormat';
import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { ToDoCard } from '@/components/host/home/ToDoCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { Task } from '@/types/hostTypes';
import { useRefresh } from '@/hooks/useRefresh';
import { toDateKey } from '@/lib/datetime';
import { ApiTodoEvent, toTodoTask } from '@/lib/mappers';
import { useGetHostDashboardQuery } from '@/redux/services/accommodationApi';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function AllToDoTasksScreen() {
    const t = useT();
    const { formatDate } = useFormat();
    const router = useRouter();

    const { data, isLoading, refetch } = useGetHostDashboardQuery({ page: 1, limit: 100 });
    const { refreshing, onRefresh } = useRefresh([refetch]);

    const events = useMemo(
        () => (data?.to_do?.data ?? []) as ApiTodoEvent[],
        [data],
    );

    // Newest first from the backend; grouped here into "Today" + calendar days.
    const groups = useMemo(() => {
        const today = toDateKey(new Date());
        const byDay = new Map<string, { date: string; tasks: Task[] }>();

        events.forEach((event) => {
            const key = toDateKey(event.timestamp);
            const label =
                key === today
                    ? 'Today'
                    : formatDate(event.timestamp, { day: 'numeric', month: 'long' });
            if (!byDay.has(key)) byDay.set(key, { date: label, tasks: [] });
            byDay.get(key)!.tasks.push(toTodoTask(event));
        });

        return Array.from(byDay.values());
    }, [events]);

    const handleTaskPress = (item: Task) => {
        const source = events.find(
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
            <SectionTitle title={t("To Do")} />

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
                        {t("Nothing to do right now.")}
                    </Caption3>
                )}

                {groups.map((group, index) => (
                    <View key={`${group.date}-${index}`}>
                        {/* Date header */}
                        <Caption1 color={Colors.TEXT_COLOR} style={styles.dateHeader}>
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
