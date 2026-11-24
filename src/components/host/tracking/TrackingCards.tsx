import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { AppImage } from '@/components/shared/AppImage';
import { Caption1, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useT } from '@/i18n';
import { formatCleaningWindow } from '@/lib/datetime';
import {
    CONNECTION_META,
    PROGRESS_STEPS,
    progressOf,
    TONE_COLORS,
    TRACKING_META,
    trackingStatusOf,
    type Tone,
} from '@/lib/hostTracking';
import { accommodationPhoto, avatarSource, personName } from '@/lib/mappers';
import { useFormat } from '@/lib/useFormat';
import type { CleanerAssignment, CleaningSchedule } from '@/redux/types';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

export function StatusPill({ label, tone }: { label: string; tone: Tone }) {
    const c = TONE_COLORS[tone];
    return (
        <View style={[styles.pill, { backgroundColor: c.bg }]}>
            <View style={[styles.pillDot, { backgroundColor: c.fg }]} />
            <Caption4 color={c.fg} style={styles.pillText} numberOfLines={1}>
                {label}
            </Caption4>
        </View>
    );
}

/** Sent → Accepted → Paid → Done, filled up to the current step. */
function ProgressLine({ reached, tone }: { reached: number; tone: Tone }) {
    const t = useT();
    const active = tone === 'danger' ? TONE_COLORS.danger.fg : Colors.BRAND_PRIMARY;
    return (
        <View style={styles.progress}>
            {PROGRESS_STEPS.map((step, i) => {
                const done = i < reached;
                return (
                    <View key={step} style={styles.progressStep}>
                        <View
                            style={[
                                styles.progressBar,
                                { backgroundColor: done ? active : Colors.BORDER_COLOR },
                            ]}
                        />
                        <Caption4 color={done ? Colors.PRIMARY_TEXT : Colors.TEXT_COLOR}>
                            {t(step)}
                        </Caption4>
                    </View>
                );
            })}
        </View>
    );
}

export function ScheduleTrackCard({
    schedule,
    onPress,
}: {
    schedule: CleaningSchedule;
    onPress: (schedule: CleaningSchedule) => void;
}) {
    const t = useT();
    const { formatDate } = useFormat();
    const accommodation = (schedule.accommodation ?? {}) as any;
    const cleaner = (schedule.cleaner ?? {}) as any;
    const status = trackingStatusOf(schedule);
    const meta = TRACKING_META[status];
    const reached = progressOf(status);
    const slot = formatCleaningWindow(schedule.checkInTime, schedule.checkOutTime);

    return (
        <Pressable style={styles.card} onPress={() => onPress(schedule)} accessibilityRole="button">
            <View style={styles.row}>
                <AppImage source={accommodationPhoto(accommodation)} style={styles.thumb} contentFit="cover" />
                <View style={styles.body}>
                    <View style={styles.titleRow}>
                        <Caption1 color={Colors.PRIMARY_TEXT} style={{ flex: 1 }} numberOfLines={1}>
                            {accommodation?.name ?? t('Accommodation')}
                        </Caption1>
                        <RightAngleIcon size={18} color={Colors.TEXT_COLOR} />
                    </View>
                    <StatusPill label={t(meta.label)} tone={meta.tone} />
                    <View style={styles.metaRow}>
                        <CalendarIcon size={14} color={Colors.TEXT_COLOR} />
                        <Caption3 color={Colors.PRIMARY_TEXT} numberOfLines={1} style={{ flex: 1 }}>
                            {formatDate(schedule.date, { weekday: 'short', day: 'numeric', month: 'short' })}
                            {slot ? ` · ${slot}` : ''}
                        </Caption3>
                    </View>
                    <View style={styles.metaRow}>
                        <AppImage source={avatarSource(cleaner?.profileImage)} style={styles.avatar} contentFit="cover" />
                        <Caption3 color={Colors.TEXT_COLOR} numberOfLines={1}>
                            {personName(cleaner, t('Housekeeper'))}
                        </Caption3>
                    </View>
                </View>
            </View>
            {reached !== null && <ProgressLine reached={reached} tone={meta.tone} />}
        </Pressable>
    );
}

export function ConnectionTrackCard({
    assignment,
    onPress,
}: {
    assignment: CleanerAssignment;
    onPress: (assignment: CleanerAssignment) => void;
}) {
    const t = useT();
    const { formatDate } = useFormat();
    const accommodation = (assignment.accommodation ?? {}) as any;
    const cleaner = (assignment.cleaner ?? {}) as any;
    const meta = CONNECTION_META[assignment.status] ?? CONNECTION_META.pending;
    const when =
        assignment.status === 'left'
            ? assignment.leftAt
            : assignment.status === 'pending'
              ? assignment.createdAt
              : (assignment.respondedAt ?? assignment.createdAt);
    const whenLabel =
        assignment.status === 'pending'
            ? t('Sent on {date}', { date: formatDate(when, { day: 'numeric', month: 'short' }) })
            : formatDate(when, { day: 'numeric', month: 'short' });

    return (
        <Pressable style={styles.card} onPress={() => onPress(assignment)} accessibilityRole="button">
            <View style={styles.row}>
                <AppImage source={avatarSource(cleaner?.profileImage)} style={styles.bigAvatar} contentFit="cover" />
                <View style={styles.body}>
                    <View style={styles.titleRow}>
                        <Caption1 color={Colors.PRIMARY_TEXT} style={{ flex: 1 }} numberOfLines={1}>
                            {personName(cleaner, t('Housekeeper'))}
                        </Caption1>
                        <RightAngleIcon size={18} color={Colors.TEXT_COLOR} />
                    </View>
                    <StatusPill label={t(meta.label)} tone={meta.tone} />
                    <Caption3 color={Colors.TEXT_COLOR} numberOfLines={1}>
                        {accommodation?.name ?? t('Accommodation')}
                        {' · '}
                        {assignment.role === 'primary' ? t('Primary') : t('Substitute')}
                    </Caption3>
                    {!!when && (
                        <Caption4 color={Colors.TEXT_COLOR}>{whenLabel}</Caption4>
                    )}
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        padding: wp(12),
        marginBottom: hp(12),
    },
    row: { flexDirection: 'row', gap: wp(12) },
    thumb: { width: wp(72), height: wp(72), borderRadius: wp(10) },
    bigAvatar: { width: wp(52), height: wp(52), borderRadius: wp(26) },
    body: { flex: 1, gap: hp(5) },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: wp(6) },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: wp(6) },
    avatar: { width: wp(18), height: wp(18), borderRadius: wp(9) },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: wp(5),
        paddingHorizontal: wp(8),
        paddingVertical: hp(3),
        borderRadius: wp(20),
        maxWidth: '100%',
    },
    pillDot: { width: wp(6), height: wp(6), borderRadius: wp(3) },
    pillText: { fontFamily: 'Poppins_600SemiBold' },
    progress: { flexDirection: 'row', gap: wp(6), marginTop: hp(12) },
    progressStep: { flex: 1, gap: hp(4) },
    progressBar: { height: hp(4), borderRadius: hp(2) },
});
