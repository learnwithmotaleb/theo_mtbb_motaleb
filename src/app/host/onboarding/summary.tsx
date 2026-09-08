import { useFormat } from '@/lib/useFormat';
import { useT } from '@/i18n';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Body5, Body6, Caption1, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';

import { useAppSelector } from '@/redux/hooks';
import {
    buildAccommodationForm,
    useCreateAccommodationMutation,
} from '@/redux/services/accommodationApi';
import { draftToFields, validateDraft } from '@/redux/slices/accommodationDraftSlice';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function SummaryRow({
    label,
    value,
    onEdit,
}: {
    label: string;
    value: string;
    onEdit: () => void;
}) {
    const t = useT();
    return (
        <View style={styles.rowBlock}>
            <Body5 color={Colors.TEXT_COLOR} style={styles.rowLabel}>
                {label}
            </Body5>
            <View style={styles.rowCard}>
                <Caption1 color={Colors.PLACEHOLDER_TEXT} style={styles.rowValue}>
                    {value}
                </Caption1>
                <Pressable
                    onPress={onEdit}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Body6 color={Colors.STATUS_COLOR}>{t("Edit")}</Body6>
                </Pressable>
            </View>
        </View>
    );
}

export default function SummaryScreen() {
    const t = useT();
    const { formatMoney } = useFormat();
    const router = useRouter();
    const draft = useAppSelector((state) => state.accommodationDraft);
    const [createAccommodation, { isLoading }] = useCreateAccommodationMutation();

    const summary = useMemo(
        () => [
            {
                label: t("Property name"),
                value: draft.name || t("Not set"),
                route: '/host/onboarding/accommodation',
            },
            {
                label: t("Address"),
                value:
                    [draft.address, draft.zipCode, draft.city].filter(Boolean).join(', ') ||
                    t("Not set"),
                route: '/host/onboarding/location',
            },
            {
                label: t("Type"),
                value: draft.accommodationType,
                route: '/host/onboarding/property',
            },
            {
                label: t("Rooms / Surface"),
                value: t("{rooms} room(s) / {surface} m2", { rooms: draft.numberOfRooms, surface: draft.surface || '-' }),
                route: '/host/onboarding/property',
            },
            {
                label: t("Time slot"),
                value: t("Between {from} and {to}", { from: draft.checkOutTime, to: draft.checkInTime }),
                route: '/host/onboarding/cleaning_time',
            },
            {
                label: t("Average duration"),
                value: draft.instructions || t("Not set"),
                route: '/host/onboarding/cleaning_duration',
            },
            {
                label: t("Proposed rate"),
                value: draft.cleaningRate
                    ? `${formatMoney(Number(draft.cleaningRate))} / cleaning`
                    : 'Not set',
                route: '/host/onboarding/cleaning_duration',
            },
        ],
        [draft, t],
    );

    // The whole wizard is one POST /accommodation — nothing was saved before.
    const handleConfirm = async () => {
        const problem = validateDraft(draft);
        if (problem) {
            showToast(problem, 'error');
            return;
        }
        try {
            await createAccommodation(
                buildAccommodationForm(draftToFields(draft), draft.photos),
            ).unwrap();
            router.push('/host/onboarding/congratulations');
        } catch (err) {
            showToast(
                getApiErrorMessage(err, t("Could not create the accommodation.")),
                'error',
            );
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
           
<SectionTitle/>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <H2 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    {t("Summary")}
                </H2>
                <Body6 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    {t("Verify your property information before continuing.")}
                </Body6>

                {summary.map((item) => (
                    <SummaryRow
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        onEdit={() => router.push(item.route as any)}
                    />
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    onPress={handleConfirm}
                    title={t("Confirm and continue")}
                    backgroundColor={Colors.BG_BLACK}
                    width="100%"
                    height={hp(54)}
                    borderRadius={wp(14)}
                    isLoading={isLoading}
                    disabled={isLoading}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
          paddingHorizontal: wp(20),
    },
    backBtn: {
        marginTop: hp(12),
        marginLeft: wp(20),
        width: wp(32),
    },
    scroll: {
        paddingBottom: hp(20),
    },
    title: {
        marginVertical: hp(12),
    },
    subtitle: {
        marginBottom: hp(20),
    },
    rowBlock: {
        marginBottom: hp(14),
    },
    rowLabel: {
        marginBottom: hp(6),
    },
    rowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        paddingVertical: hp(16),
    },
    rowValue: {
        flex: 1,
        marginRight: wp(12),
    },
    footer: {
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});