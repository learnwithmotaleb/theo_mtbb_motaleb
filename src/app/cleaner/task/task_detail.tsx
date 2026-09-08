import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Body5, Body6, Caption2, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { formatClock } from '@/lib/datetime';
import { toCleanerTask } from '@/lib/mappers';
import {
    useGetScheduleByIdQuery,
    useReportDisputeMutation,
} from '@/redux/services/scheduleApi';
import type { MissionCard } from '@/redux/types';
import { AppImage } from '@/components/shared/AppImage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <Caption3 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>{label}</Caption3>
            <Caption3 color={Colors.PRIMARY_TEXT}>{value}</Caption3>
        </View>
    );
}

export default function TaskDetailScreen() {
    const t = useT();
    const router = useRouter();
    const { taskId, dispute } = useLocalSearchParams<{
        taskId: string;
        dispute?: string;
    }>();

    const { data: schedule, isLoading } = useGetScheduleByIdQuery(taskId, {
        skip: !taskId,
    });
    const [reportDispute, { isLoading: isReporting }] = useReportDisputeMutation();

    // Opened straight into the dispute form when the details screen sent us here.
    const [disputeOpen, setDisputeOpen] = useState(dispute === '1');
    const [disputeNotes, setDisputeNotes] = useState('');
    const [disputePhotos, setDisputePhotos] = useState<string[]>([]);

    const detail = useMemo(
        () =>
            toCleanerTask({
                ...(schedule ?? {}),
                dayKey: '',
                dayLabel: '',
                estimationHours: 0,
                payAmount: null,
                payCurrency: 'EUR',
            } as MissionCard),
        [schedule],
    );

    // The estimation the backend derives is only on the mission-card payloads,
    // so it is recomputed here from the schedule's own times.
    const estimation = useMemo(() => {
        const toMinutes = (value?: string) => {
            const [h, m] = (value ?? '').split(':').map(Number);
            return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
        };
        const start = toMinutes(schedule?.checkInTime);
        const end = toMinutes(schedule?.checkOutTime);
        if (start === null || end === null || end <= start) return '—';
        return `${Math.round(((end - start) / 60) * 10) / 10}h`;
    }, [schedule]);

    const task = {
        image: detail.image,
        apartmentName: detail.apartmentName,
        address: detail.address,
        time: `${formatClock(schedule?.checkInTime)} – ${formatClock(schedule?.checkOutTime)}`,
        estimation,
    };

    const addDisputePhoto = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setDisputePhotos((prev) => [...prev, result.assets[0].uri]);
        }
    };

    const submitDispute = async () => {
        if (!taskId) return;
        if (!disputeNotes.trim()) {
            showToast(t("Describe the problem first."), 'error');
            return;
        }
        try {
            await reportDispute({
                id: taskId,
                reason: disputeNotes.trim().slice(0, 80),
                notes: disputeNotes.trim(),
                photos: disputePhotos.map((uri) => ({ uri })),
            }).unwrap();
            setDisputeOpen(false);
            setDisputeNotes('');
            setDisputePhotos([]);
            showToast(t("Problem reported to the host"), 'success');
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not report the problem.")), 'error');
        }
    };

    if (isLoading && !schedule) {
        return (
            <SafeAreaView style={[styles.safe, { paddingTop: hp(16) }]}>
                <SkeletonDetail />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t("Task Details")} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero image */}
                <View style={styles.timeCard}>
                    <AppImage
                        source={task.image}
                        style={styles.heroImage}
                        contentFit="cover"
                    />

                    {/* Name + address */}
                    <View style={styles.nameSection}>
                        <Body6 color={Colors.PRIMARY_TEXT}>{task.apartmentName}</Body6>
                        <View style={styles.row}>
                            <LocationIcon size={13} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{task.address}</Caption3>
                        </View>
                    </View>
                </View>

                {/* Time card */}
                <View style={styles.timeCard}>
                    <View style={styles.timeRow}>
                        <ClockIcon size={16} color={Colors.TEXT_COLOR} />
                        <Caption3 color={Colors.TEXT_COLOR}>{t("Time slot")}</Caption3>
                        <Caption3 color={Colors.PRIMARY_TEXT} style={{ marginLeft: 'auto' }}>
                            {task.time}
                        </Caption3>
                    </View>
                    {/* <View style={styles.divider} /> */}
                    <View style={styles.timeRow}>
                        <ClockIcon size={16} color={Colors.TEXT_COLOR} />
                        <Caption3 color={Colors.TEXT_COLOR}>{t("Estimation")}</Caption3>
                        <Caption3 color={Colors.PRIMARY_TEXT} style={{ marginLeft: 'auto' }}>
                            {task.estimation}
                        </Caption3>
                    </View>
                </View>

                {/* Accommodation info */}

                <View style={styles.card}>
                    <Caption2
                        color={Colors.TEXT_COLOR}
                        style={styles.sectionLabel}
                    >
                        {t("ACCOMMODATION DETAILS")}
                    </Caption2>
                    <InfoRow label={t("Accommodation Type")} value={detail.type || '—'} />
                    <InfoRow label={t("Bedrooms")} value={detail.rooms || '—'} />
                    <InfoRow label={t("Surface")} value={detail.surface || '—'} />
                    <InfoRow label={t("Floor")} value={detail.floor || '—'} />
                    <InfoRow label={t("Elevator")} value={detail.access} />
                </View>

                {/* Cleaning rate */}
                <View style={styles.card}>
                    <Caption2
                        color={Colors.TEXT_COLOR}
                        style={styles.sectionLabel}
                    >
                        {t("CLEANING RATE")}
                    </Caption2>
                    <InfoRow label={t("Cleaning Service")} value={detail.cleaningRate} />
                </View>

                {/* Practical info */}
                <View style={styles.keyBoxContainer}>
                    <Caption2
                        color={Colors.TEXT_COLOR}
                        style={styles.sectionLabel}
                    >
                        {t("PRACTICAL INFORMATION")}
                    </Caption2>
                    <View style={styles.keyRow}>
                        <View style={styles.keyBox}>
                            <Caption4 color={Colors.TEXT_COLOR}>{t("Key Box")}</Caption4>
                            <Body6 color={Colors.PRIMARY_TEXT}>{detail.keyBox}</Body6>
                        </View>
                        <View style={styles.keyBox}>
                            <Caption4 color={Colors.TEXT_COLOR}>{t("Key Box Code")}</Caption4>
                            <Body6 color={Colors.PRIMARY_TEXT}>{detail.keyBoxCode || '—'}</Body6>
                        </View>
                    </View>

                </View>
                <View style={styles.instructionBox}>
                    <Caption4 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(6) }}>
                        {t("Specific Instruction")}
                    </Caption4>
                    <Caption3 color={Colors.TEXT_COLOR}>
                        {detail.specificInstruction || t("No specific instruction.")}
                    </Caption3>
                </View>

                <CustomButton
                    title={t("Report a problem")}
                    onPress={() => setDisputeOpen(true)}
                    width="100%"
                    backgroundColor='#74748014'
                    color='#4B4B4B'
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </ScrollView>

            {/* ── Dispute ── */}
            <Modal visible={disputeOpen} transparent animationType="slide">
                <Pressable style={styles.backdrop} onPress={() => setDisputeOpen(false)}>
                    <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                        <Body5 color={Colors.PRIMARY_TEXT} style={{ marginBottom: hp(10) }}>
                            {t("Report a problem")}
                        </Body5>
                        <Caption3 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(10) }}>
                            {t("Tell the host what you found. Photos help them resolve it faster.")}
                        </Caption3>

                        <View style={styles.disputeBox}>
                            <TextInput
                                style={styles.disputeInput}
                                value={disputeNotes}
                                onChangeText={setDisputeNotes}
                                placeholder={t("Describe the problem...")}
                                placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <Pressable style={styles.addPhotoBtn} onPress={addDisputePhoto}>
                            <Caption3 color={Colors.PRIMARY_TEXT}>
                                Add a photo{disputePhotos.length ? ` (${disputePhotos.length})` : ''}
                            </Caption3>
                        </Pressable>

                        <CustomButton
                            title={isReporting ? 'Sending...' : 'Send report'}
                            onPress={submitDispute}
                            disabled={isReporting}
                            width="100%"
                            backgroundColor={Colors.PRIMARY_TEXT}
                            color={Colors.TEXT_WHITE}
                            borderRadius={wp(8)}
                            height={hp(52)}
                        />
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Footer */}
            {/* <View style={styles.footer}>
                <CustomButton
                    title={t("Start Cleaning")}
                    onPress={() =>
                        // router.push({
                        //     pathname: '/cleaner/task/checklist' as any,
                        //     params: { taskId: task.id },
                        // })
                        {}
                    }
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color={Colors.TEXT_WHITE}
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: Colors.APP_BACKGROUND,
        borderTopLeftRadius: wp(20),
        borderTopRightRadius: wp(20),
        padding: wp(20),
    },
    disputeBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(14),
        minHeight: hp(110),
        marginBottom: hp(12),
    },
    disputeInput: {
        fontSize: 13,
        color: Colors.TEXT_COLOR,
        fontFamily: 'Poppins_400Regular',
        minHeight: hp(90),
        padding: 0,
    },
    addPhotoBtn: {
        alignItems: 'center',
        paddingVertical: hp(14),
        borderRadius: wp(8),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        marginBottom: hp(14),
    },
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: { paddingBottom: hp(120) },

    heroImage: {
        width: '100%',
        height: hp(200),
        borderRadius: wp(14),
        marginVertical: hp(14),
    },
    nameSection: {
        gap: hp(5),
        marginBottom: hp(14),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(4),
    },

    // Time card
    timeCard: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        paddingHorizontal: wp(16),
        marginBottom: hp(20),
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        paddingVertical: hp(14),
    },

    // Section labels
    sectionLabel: {
        letterSpacing: 0.6,
        marginVertical: hp(10),
    },

    // Info card
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        paddingHorizontal: wp(16),
        marginBottom: hp(20),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(12),
    },
    divider: {
        height: 1,
        backgroundColor: Colors.BORDER_COLOR,
    },

    // Key box
    keyBoxContainer: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(12),
        gap: hp(4),
        marginBottom:hp(20)
    },
    keyRow: {
        flexDirection: 'row',
        gap: wp(12),
        marginBottom: hp(12),
    },
    keyBox: {
        flex: 1,
        backgroundColor: Colors.BORDER_COLOR,
        borderRadius: wp(10),
        padding: wp(12),
        gap: hp(4),
    },
    instructionBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        padding: wp(12),
        marginBottom: hp(16),
    },

    // Footer
    footer: {
        // paddingVertical: hp(16),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});