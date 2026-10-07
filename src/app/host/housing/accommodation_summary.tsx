import { useFormat } from '@/lib/useFormat';
import { useT } from '@/i18n';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body2, Body5, Caption2, Caption3 } from '@/components/typo/Typography';
import { showToast } from '@/components/shared/Toast';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import {
    elevatorText,
    hasFloorAndElevator,
    keysText,
    roomsText,
} from '@/constants/accommodation';
import { getApiErrorMessage } from '@/lib/apiError';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    buildAccommodationForm,
    useCreateAccommodationMutation,
    useUpdateAccommodationMutation,
} from '@/redux/services/accommodationApi';
import {
    draftToFields,
    resetDraft,
    validateDraft,
} from '@/redux/slices/accommodationDraftSlice';
import { AppImage } from '@/components/shared/AppImage';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={styles.summaryCard}>
            <Body2 color={Colors.TEXT_COLOR} style={styles.cardTitle}>
                {title}
            </Body2>
            {/* <View style={styles.divider} /> */}
            {children}
        </View>
    );
}

export default function AccommodationSummaryScreen() {
    const t = useT();
    const { formatMoney } = useFormat();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.accommodationDraft);

    const [createAccommodation, { isLoading: isCreating }] =
        useCreateAccommodationMutation();
    const [updateAccommodation, { isLoading: isUpdating }] =
        useUpdateAccommodationMutation();

    const isSaving = isCreating || isUpdating;

    const SUMMARY = useMemo(
        () => ({
            general: {
                name: draft.name,
                type: draft.accommodationType ? t(draft.accommodationType) : '—',
                address: [draft.address, draft.zipCode, draft.city]
                    .filter(Boolean)
                    .join(', '),
            },
            details: {
                rooms: roomsText(draft.numberOfRooms, t) || '—',
                surface: draft.surface ? `${draft.surface} m²` : '—',
                // Only apartments and studios are asked about floor and elevator.
                showFloor: hasFloorAndElevator(draft.accommodationType),
                floor: draft.floor || '—',
                elevator: elevatorText(draft.hasElevator, t),
                cleaningRate: formatMoney(Number(draft.cleaningRate) || 0),
            },
            photo: draft.photos[0]
                ? { uri: draft.photos[0].uri }
                : IMAGE_COMPONENTS.apartment,
            practical: {
                keys: keysText(draft.keys, t) || '—',
                accessCode: draft.accessCode || '—',
                instructions: draft.instructions || '—',
                frequency: draft.frequency ? t(draft.frequency) : '—',
                checkOut: draft.checkOutTime || '—',
                checkIn: draft.checkInTime || '—',
            },
        }),
        [draft, t, formatMoney],
    );

    const handleSubmit = async () => {
        if (isSaving) return;
        const problem = validateDraft(draft);
        if (problem) {
            showToast(t(problem), 'error');
            return;
        }

        const body = buildAccommodationForm(draftToFields(draft), draft.photos);

        try {
            if (draft.editingId) {
                await updateAccommodation({ id: draft.editingId, body }).unwrap();
                showToast(t("Accommodation updated"), 'success');
                dispatch(resetDraft());
                router.replace('/host/(tabs)/housing' as any);
                return;
            }
            const created = await createAccommodation(body).unwrap();
            showToast(t("Accommodation created"), 'success');
            dispatch(resetDraft());
            // Next step of the setup: the property page, whose main action is
            // now "Assign a cleaner". Its back button returns to the list.
            router.dismissTo('/host/(tabs)/housing' as any);
            if (created?._id) {
                router.push({
                    pathname: '/host/housing/accommodation_details_view',
                    params: { id: created._id },
                } as any);
            }
        } catch (err) {
            showToast(
                getApiErrorMessage(err, t("Could not save the accommodation.")),
                'error',
            );
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            
            <View style={{ paddingHorizontal: wp(20), }}>
                <SectionTitle title={t("Summary")} />
            </View>
            <View style={{ marginVertical: hp(20) }}>
                <StepIndicator totalSteps={5} currentStep={5} activeColor='#0088FF' inactiveColor='#0088FF' />
            </View>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <Body5
                    color={Colors.PRIMARY_TEXT}
                    align="center"
                    style={styles.title}
                >
                    {t("Summary")}
                </Body5>
                <Caption3
                    color={Colors.TEXT_COLOR}
                    align="center"
                    style={styles.subtitle}
                >
                    {t("Verify your accommodation information before finalizing.")}
                </Caption3>

                {/* General information */}
                <SummaryCard title={t("General information:")}>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.general.name}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.general.type}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.general.address}
                    </Caption3>
                </SummaryCard>

                {/* Accommodation details */}
                <SummaryCard title={t("Accommodation details:")}>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {t("Rooms")}: {SUMMARY.details.rooms}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {t("Surface")}: {SUMMARY.details.surface}
                    </Caption3>
                    {SUMMARY.details.showFloor && (
                        <>
                            <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                                {t("Floor")}: {SUMMARY.details.floor}
                            </Caption3>
                            <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                                {t("Elevator")}: {SUMMARY.details.elevator}
                            </Caption3>
                        </>
                    )}
                    <Caption3 color={"#1070B7"}>
                        {t("Cleaning rate")}: {SUMMARY.details.cleaningRate}
                    </Caption3>
                </SummaryCard>

                {/* Photos */}
                <SummaryCard title={t("Photos:")}>
                    <AppImage
                        source={SUMMARY.photo}
                        style={styles.photo}
                        contentFit="cover"
                    />
                </SummaryCard>

                {/* Practical information */}
                <SummaryCard title={t("Practical information:")}>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {t("Keys")}: {SUMMARY.practical.keys}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {t("Access code")}: {SUMMARY.practical.accessCode}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {t("Instructions")}: {SUMMARY.practical.instructions}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {t("Frequency")}: {SUMMARY.practical.frequency}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {t("Guest check-out time")}: {SUMMARY.practical.checkOut}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {t("Next guest check-in time")}: {SUMMARY.practical.checkIn}
                    </Caption3>
                </SummaryCard>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <CustomButton
                    title={
                        isSaving
                            ? t('Saving...')
                            : draft.editingId
                              ? t('Save the changes')
                              : t('Create the accommodation')
                    }
                    disabled={isSaving}
                    onPress={handleSubmit}
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
                <Pressable
                    // Back to step 1 instead of stacking a second copy of the wizard.
                    onPress={() => router.dismissTo('/host/housing/general_information' as any)}
                >
                    <Caption2 color={"#1070B7"}>{t("Edit")}</Caption2>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    scroll: { paddingHorizontal: wp(20), paddingBottom: hp(20) },
    title: { marginBottom: hp(4), fontFamily: 'Poppins_600SemiBold' },
    subtitle: { marginBottom: hp(20) },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: wp(12),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: wp(16),
        marginBottom: hp(12),
    },
    cardTitle: {
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: hp(10),
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: hp(10),
    },
    infoText: {
        marginBottom: hp(4),
        color: '#888',
    },
    photo: {
        width: "100%",
        height: hp(150),
        borderRadius: wp(8),
        marginTop: hp(4),
    },
    footer: {
        paddingHorizontal: wp(20),
        // paddingVertical: hp(24),
        paddingBottom:hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
        alignItems: 'center',
        gap: hp(12),
    },
});