import { useFormat } from '@/lib/useFormat';
import { useT } from '@/i18n';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body2, Body5, Caption2, Caption3 } from '@/components/typo/Typography';
import { showToast } from '@/components/shared/Toast';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
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
                address: [draft.address, draft.zipCode, draft.city]
                    .filter(Boolean)
                    .join(', '),
            },
            details: {
                rooms: `${draft.numberOfRooms} rooms`,
                surface: draft.surface ? `${draft.surface} m²` : '—',
                floor: draft.floor || '—',
                elevator: draft.hasElevator ? 'With elevator' : 'No elevator',
                cleaningRate: formatMoney(Number(draft.cleaningRate) || 0),
            },
            photo: draft.photos[0]
                ? { uri: draft.photos[0].uri }
                : IMAGE_COMPONENTS.apartment,
            practical: {
                keys: draft.keys || '—',
                accessCode: draft.accessCode || '–',
                instructions: draft.instructions || '—',
                frequency: draft.frequency || '—',
                times: `${draft.checkOutTime} → ${draft.checkInTime}`,
            },
        }),
        [draft],
    );

    const handleSubmit = async () => {
        const problem = validateDraft(draft);
        if (problem) {
            showToast(problem, 'error');
            return;
        }

        const body = buildAccommodationForm(draftToFields(draft), draft.photos);

        try {
            if (draft.editingId) {
                await updateAccommodation({ id: draft.editingId, body }).unwrap();
                showToast(t("Accommodation updated"), 'success');
            } else {
                await createAccommodation(body).unwrap();
                showToast(t("Accommodation created"), 'success');
            }
            dispatch(resetDraft());
            router.replace('/host/(tabs)/housing' as any);
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
                <SectionTitle title={t("Practical information")} />
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
                        {SUMMARY.general.address}
                    </Caption3>
                </SummaryCard>

                {/* Accommodation details */}
                <SummaryCard title={t("Accommodation details:")}>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.details.rooms}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.details.surface}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.details.floor}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.details.elevator}
                    </Caption3>
                    <Caption3 color={"#1070B7"}>
                        Cleaning rate : {SUMMARY.details.cleaningRate}
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
                        Keys: {SUMMARY.practical.keys}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        Access code: {SUMMARY.practical.accessCode}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        Instructions: {SUMMARY.practical.instructions}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        Frequency: {SUMMARY.practical.frequency}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        Check-out / check-in: {SUMMARY.practical.times}
                    </Caption3>
                </SummaryCard>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <CustomButton
                    title={
                        isSaving
                            ? 'Saving...'
                            : draft.editingId
                              ? 'Save the changes'
                              : 'Create the accommodation'
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
                    onPress={() => router.push('/host/housing/general_information' as any)}
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