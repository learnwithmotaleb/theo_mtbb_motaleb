import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { DateScrollPicker } from '@/components/cleaner/task/Datescrollpicker';
import { Body4, Body5, Caption2, Caption3, Caption4, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { ALL_PLANNING_TASKS, PLANNING_DATA } from '@/data/planningfakedata';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const FULL_DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const FULL_MONTH_NAMES = ['January','February','March','April','May','June',
                          'July','August','September','October','November','December'];

function toISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatSectionTitle(dateStr: string) {
    const [y, mo, d] = dateStr.split('-').map(Number);
    const date = new Date(y, mo - 1, d);
    return `${FULL_DAY_NAMES[date.getDay()]} ${date.getDate()} ${FULL_MONTH_NAMES[date.getMonth()]}`;
}

function TaskCard({
    item,
    onPress,
}: {
    item: typeof ALL_PLANNING_TASKS[0];
    onPress: () => void;
}) {
    return (
        <Pressable style={styles.taskCard} onPress={onPress}>
            <Image source={item.image} style={styles.taskThumb} contentFit="cover" />
            <View style={styles.taskInfo}>
                <Caption2 color={Colors.PRIMARY_TEXT} numberOfLines={1}>
                    {item.apartmentName}
                </Caption2>
                <View style={styles.row}>
                    <LocationIcon size={13} color={Colors.TEXT_COLOR} />
                    <Caption4
                        color={Colors.TEXT_COLOR}
                        numberOfLines={1}
                        style={{ flex: 1 }}
                    >
                        {item.address}
                    </Caption4>
                </View>
                <View style={styles.estimationBadge}>
                    <Caption4 color={Colors.TEXT_COLOR}>
                        Estimation: {item.estimation}
                    </Caption4>
                </View>
                <Body4 color={Colors.PRIMARY_TEXT}>{item.time}</Body4>
            </View>
            <RightAngleIcon size={28} color={Colors.TEXT_COLOR} />
        </Pressable>
    );
}

export default function PlanningScreen() {
    const router = useRouter();

    const todayISO = toISO(new Date());
    const [selectedDate, setSelectedDate] = useState(todayISO);

    const activeDates = PLANNING_DATA
        .filter((d) => d.tasks.length > 0)
        .map((d) => d.date);

    const dayPlan = PLANNING_DATA.find((d) => d.date === selectedDate);
    const tasks   = dayPlan?.tasks ?? [];
    const missionLabel = tasks.length === 1 ? '1 mission' : `${tasks.length} missions`;

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {/* Page title */}
                <View style={styles.titleRow}>
                    <H6 color={Colors.PRIMARY_TEXT}>Planning</H6>
                    <Caption3 color={Colors.TEXT_COLOR}>Your upcoming mission</Caption3>
                </View>

                {/* Date scroll */}
                <DateScrollPicker
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    activeDates={activeDates}
                />

                
                <View style={styles.sectionHeader}>
                    <Body5 color={Colors.PRIMARY_TEXT}>
                        {formatSectionTitle(selectedDate)}
                    </Body5>
                    {tasks.length > 0 && (
                        <View style={styles.missionBadge}>
                            <Caption3 color={Colors.TEXT_COLOR}>{missionLabel}</Caption3>
                        </View>
                    )}
                </View>

                {/* Task list */}
                {tasks.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            No missions for this day
                        </Caption3>
                    </View>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            item={task}
                            onPress={() =>
                                router.push({
                                    pathname: '/cleaner/task/task_detail' as any,
                                    params: { taskId: task.id },
                                })
                            }
                        />
                    ))
                )}
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
        paddingBottom: hp(100),
    },
    titleRow: {
        marginVertical: hp(20),
        gap: hp(2),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(15),      // ← date picker এর ঠিক নিচে
        marginBottom: hp(12),
    },
    missionBadge: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(20),
        paddingHorizontal: wp(12),
        paddingVertical: hp(5),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        marginBottom: hp(12),
        overflow: 'hidden',
        gap: wp(12),
        padding: wp(8),
    },
    taskThumb: {
        width: wp(110),
        height: hp(120),
        flexShrink: 0,
        borderRadius:wp(8),
        padding:6
    },
    taskInfo: {
        flex: 1,
        gap: hp(5),
        paddingVertical: hp(12),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(4),
    },
    estimationBadge: {
        alignSelf: 'flex-start',
        backgroundColor: "#EEEEEE",
        borderRadius: wp(6),
        paddingHorizontal: wp(8),
        paddingVertical: hp(3),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    emptyBox: {
        alignItems: 'center',
        paddingVertical: hp(40),
    },
});