import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { InfoIcon } from '@/assets/icons/common_icon/InfoIcon';
import { CameraIcon } from '@/assets/icons/host_icon/CameraIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { ChecklistSentModal } from '@/components/cleaner/task/ChecklistSentModal';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Caption2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { formatClock } from '@/lib/datetime';
import { accommodationLocation, accommodationPhoto } from '@/lib/mappers';
import {
    useGetScheduleByIdQuery,
    useSubmitProofMutation,
} from '@/redux/services/scheduleApi';
import { AppImage } from '@/components/shared/AppImage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function ChecklistScreen() {
    const t = useT();
    const router = useRouter();
    const { taskId } = useLocalSearchParams<{ taskId: string }>();

    const { data: schedule, isLoading } = useGetScheduleByIdQuery(taskId, {
        skip: !taskId,
    });
    const [submitProof, { isLoading: isSubmitting }] = useSubmitProofMutation();

    const [photos, setPhotos] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const task = useMemo(() => {
        const accommodation = (schedule?.accommodation ?? {}) as any;
        return {
            image: accommodationPhoto(accommodation),
            apartmentName: accommodation?.name ?? 'Accommodation',
            address: accommodationLocation(accommodation),
            time: `${formatClock(schedule?.checkInTime)} – ${formatClock(schedule?.checkOutTime)}`,
        };
    }, [schedule]);

    // Photos are the proof the host validates against, so at least one is
    // required before the mission can be submitted.
    const handleSubmit = async () => {
        if (!taskId) return;
        if (photos.length === 0) {
            showToast(t("Capture at least one photo as proof."), 'error');
            return;
        }
        try {
            await submitProof({
                id: taskId,
                proofNotes: notes.trim() || undefined,
                photos: photos.map((uri) => ({ uri })),
            }).unwrap();
            setModalVisible(true);
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not submit the proof.")), 'error');
        }
    };

    const handleCapture = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(t("Permission required"), t("Camera permission is needed."));
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setPhotos((prev) => [...prev, result.assets[0].uri]);
        }
    };

    const handleRemovePhoto = (idx: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t("Check List")} />

            {isLoading && !schedule ? (
                <SkeletonDetail />
            ) : null}

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                //  keyboardVerticalOffset={hp(10)}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Apartment info */}
                    <View style={styles.apartmentCard}>
                        <AppImage
                            source={task.image}
                            style={styles.thumb}
                            contentFit="cover"
                        />
                        <View style={styles.apartmentInfo}>
                            <Caption2 color={Colors.PRIMARY_TEXT} numberOfLines={2}>
                                {task.apartmentName}
                            </Caption2>
                            <View style={styles.row}>
                                <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                                <Caption3 color={Colors.TEXT_COLOR}>{task.address}</Caption3>
                            </View>
                            <View style={styles.row}>
                                <ClockIcon size={17} color={Colors.TEXT_COLOR} />
                                <Caption3 color={Colors.TEXT_COLOR}>{task.time}</Caption3>
                            </View>
                        </View>
                    </View>

                    {/* Info note */}
                    <View style={styles.infoNote}>
                        <InfoIcon color='#8F8F8F' />
                        <Caption3 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>
                            {t("Capture picture as a proof of task completion")}
                        </Caption3>
                    </View>

                    {/* Capture button */}
                    <Pressable style={styles.captureBtn} onPress={handleCapture}>
                        <View style={styles.iconGroup}>
                            <CameraIcon color='#303030' />
                        </View>
                        <Caption3 color={Colors.PRIMARY_TEXT}>{t("Capture Photos")}</Caption3>
                    </Pressable>

                    {/* Photos section */}
                    {photos.length > 0 && (
                        <>
                            <Caption3
                                color={Colors.TEXT_COLOR}
                                align="center"
                                style={styles.photosLabel}
                            >
                                {t("Photos")}
                            </Caption3>
                            {photos.map((uri, idx) => (
                                <View key={idx} style={styles.photoWrapper}>
                                    <AppImage
                                        source={{ uri }}
                                        style={styles.photo}
                                        contentFit="cover"
                                    />
                                    <Pressable
                                        style={styles.removeBtn}
                                        onPress={() => handleRemovePhoto(idx)}
                                    >
                                        <Caption3 color="#fff">✕</Caption3>
                                    </Pressable>
                                </View>
                            ))}
                        </>
                    )}

                    {/* Notes */}
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.notesLabel}>
                        {t("NOTES (OPTIONAL)")}
                    </Caption2>
                    <View style={styles.notesBox}>
                        <TextInput
                            style={styles.notesInput}
                            placeholder={t("Add any specific details or issues found...")}
                            placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                            textAlignVertical="top"
                        />
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <CustomButton
                        title={isSubmitting ? 'Submitting...' : 'Submit Proof'}
                        disabled={isSubmitting}
                        onPress={handleSubmit}
                        width="100%"
                        backgroundColor={Colors.COLOR_ACTIVE}
                        color="#fff"
                        borderRadius={wp(8)}
                        height={hp(52)}
                    />
                </View>
            </KeyboardAvoidingView>

            <ChecklistSentModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    // The mission is now with the host for validation.
                    router.replace('/cleaner/(tabs)' as any);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    container: { flex: 1 },
    scroll: { paddingBottom: hp(20) },

    apartmentCard: {
        flexDirection: 'row',
        gap: wp(12),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(12),
        marginBottom: hp(12),
    },
    thumb: { width: wp(70), height: hp(75), borderRadius: wp(8) },
    apartmentInfo: { flex: 1, gap: hp(4) },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },

    infoNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        backgroundColor: "#8F8F8F1A",
        borderRadius: wp(10),
        padding: wp(12),
        marginBottom: hp(16),
    },

    captureBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(8),
        gap: wp(8),
        paddingVertical: hp(14),
        marginBottom: hp(16),
    },
    iconGroup: {
        height: hp(28),
        width: wp(28),
        borderRadius: wp(3),
        backgroundColor: "#F4F4F4",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    photosLabel: { marginBottom: hp(8) },
    photoWrapper: {
        position: 'relative',
        marginBottom: hp(10),
    },
    photo: {
        width: '100%',
        height: hp(280),
        borderRadius: wp(12),
    },
    removeBtn: {
        position: 'absolute',
        top: wp(10),
        right: wp(10),
        width: wp(28),
        height: wp(28),
        borderRadius: wp(14),
        backgroundColor: '#00000060',
        alignItems: 'center',
        justifyContent: 'center',
    },

    notesLabel: {
        letterSpacing: 0.6,
        marginBottom: hp(8),
    },
    notesBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(14),
        minHeight: hp(120),
    },
    notesInput: {
        fontSize: 13,
        color: Colors.TEXT_COLOR,
        fontFamily: 'Poppins_400Regular',
        minHeight: hp(100),
        padding: 0,
    },

    footer: {

        backgroundColor: Colors.APP_BACKGROUND,
    },
});