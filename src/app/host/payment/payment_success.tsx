import { useFormat } from '@/lib/useFormat';
import { useT } from '@/i18n';
import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { HousingIcon } from '@/assets/icons/cleaner_icon/HousingIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Body7, Caption2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { formatCleaningWindow } from '@/lib/datetime';

import { personName } from '@/lib/mappers';
import { computeSchedulePrice } from '@/lib/pricing';

import { useGetScheduleByIdQuery } from '@/redux/services/scheduleApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function PaymentSuccessScreen() {
    const t = useT();
    const { formatDate, formatMoney } = useFormat();
    const router = useRouter();
    // request: the cleaner has just been asked (nothing paid yet)
    // card: paid through Stripe · hand_cash: settled outside the app
    const { scheduleId, method = 'request', total: paidTotal } = useLocalSearchParams<{
        scheduleId?: string;
        method?: 'request' | 'card' | 'hand_cash';
        total?: string;
    }>();

    const { data: schedule } = useGetScheduleByIdQuery(scheduleId as string, {
        skip: !scheduleId,
        // After a card payment the backend confirms with Stripe on this read.
        refetchOnMountOrArgChange: true,
    });

    const accommodation = useMemo(() => (schedule?.accommodation ?? {}) as any, [schedule]);
    const cleaner = useMemo(() => (schedule?.cleaner ?? {}) as any, [schedule]);
    const assignment = schedule?.assignment as any;

    const price = useMemo(
        () =>
            computeSchedulePrice(
                assignment?.pricePerCleaning,
                accommodation?.cleaningRate,
            ),
        [assignment, accommodation],
    );

    const data = useMemo(
        () => ({
            addressOneLine: [accommodation?.address, accommodation?.city]
                .filter(Boolean)
                .join(', '),
            date: formatDate(schedule?.date, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
            slot: formatCleaningWindow(schedule?.checkInTime, schedule?.checkOutTime, '  →  '),
            housekeeper: personName(cleaner, t('the cleaner')),
        }),
        [accommodation, schedule, cleaner, t, formatDate],
    );

    // A card payment shows what Stripe actually charged (fee included).
    const total = method === 'card' && Number(paidTotal) > 0 ? Number(paidTotal) : price.total;
    const serviceFee = method === 'card' && Number(paidTotal) > 0
        ? Math.max(0, Math.round((total - price.cleaningService) * 100) / 100)
        : price.serviceFee;

    const copy = {
        request: {
            title: t('Cleaning request sent'),
            text: t('Nothing has been charged. You will pay once {name} accepts the request.', { name: data.housekeeper }),
            status: t('Pending acceptance'),
            statusText: t('You will receive a notification as soon as {name} replies.', { name: data.housekeeper }),
        },
        card: {
            title: t('Payment successful'),
            text: t('The amount is held securely by Stripe and paid to the cleaner once you validate the cleaning.'),
            status: t('Paid'),
            statusText: t('The cleaning is confirmed with {name}.', { name: data.housekeeper }),
        },
        hand_cash: {
            title: t('Off-app payment chosen'),
            text: t('Nothing is charged in the app. You settle the cleaning directly with the cleaner.'),
            status: t('To settle with the cleaner'),
            statusText: t('The cleaning is confirmed with {name}.', { name: data.housekeeper }),
        },
    }[method] ?? null;

    return (
        <SafeAreaView style={successStyles.safe}>
            <SectionTitle title="" showBackButton />
            <ScrollView contentContainerStyle={successStyles.scroll} showsVerticalScrollIndicator={false}>

                {/* Success icon */}
                <View style={successStyles.iconCircle}>
                    <Body7 color="#fff" style={{ fontSize: 28 }}>✓</Body7>
                </View>
                <Body4 color={Colors.PRIMARY_TEXT} align="center" style={{ marginTop: hp(12) }}>
                    {copy?.title}
                </Body4>
                <Caption3 color={"#727272"} align="center" style={successStyles.successDesc}>
                    {copy?.text}
                </Caption3>

                {/* Status */}
                <Body4 color={Colors.PRIMARY_TEXT} style={{ marginBottom: hp(6) }}>
                    {copy?.status}
                </Body4>
                <Caption3 color={"#727272"} style={{ marginBottom: hp(16) }}>
                    {copy?.statusText}
                </Caption3>

                {/* Summary */}
                <View style={successStyles.section}>
                    <Caption2 color={"#8E8E93"} style={successStyles.label}>{t("SUMMARY")}</Caption2>
                    {[
                        { icon: <HousingIcon size={16} color={"#8E8E93"} />, label: t("Accommodation"), value: data.addressOneLine },
                        { icon: <CalendarIcon size={18} color={"#8E8E93"} />, label: t("Date"), value: data.date },
                        { icon: <ClockIcon size={14} color={"#8E8E93"} />, label: t("Arrival / Departure"), value: data.slot },
                        { icon: <UserIcon size={14} color={"#8E8E93"} />, label: t("Housekeeper"), value: data.housekeeper },
                    ].map((row, idx, arr) => (
                        <React.Fragment key={row.label}>
                            <View style={successStyles.infoRow}>
                                <View style={successStyles.infoLeft}>
                                    {row.icon}
                                    <Caption2 color={"#8E8E93"}>{row.label}</Caption2>
                                </View>
                                <Caption3 color={Colors.PRIMARY_TEXT} style={{ flex: 1, textAlign: 'right' }}>
                                    {row.value}
                                </Caption3>
                            </View>
                            {/* {idx < arr.length - 1 && <View style={successStyles.divider} />} */}
                        </React.Fragment>
                    ))}
                </View>

                {/* Price */}
                <View style={successStyles.section}>
                    <Caption2 color={"#8E8E93"} style={successStyles.label}>{t("PRICE DETAILS")}</Caption2>
                    <View style={successStyles.infoRow}>
                        <Caption2 color={"#8E8E93"}>{t("Cleaning Service")}</Caption2>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {formatMoney(price.cleaningService)}
                        </Caption3>
                    </View>
                    {/* <View style={successStyles.divider} /> */}
                    {method === 'card' && (
                        <View style={successStyles.infoRow}>
                            <Caption2 color={"#8E8E93"}>{t("Service Fee")}</Caption2>
                            <Caption3 color={Colors.TEXT_COLOR}>
                                {formatMoney(serviceFee)}
                            </Caption3>
                        </View>
                    )}
                    {/* <View style={successStyles.divider} /> */}
                    <View style={successStyles.infoRow}>
                        <Body7 color={Colors.PRIMARY_TEXT}>{method === 'card' ? t("Total paid") : t("Total")}</Body7>
                        <Body7 color={Colors.PRIMARY_TEXT}>{formatMoney(total)}</Body7>
                    </View>
                </View>

            </ScrollView>

            {/* Footer */}
            <View style={successStyles.footer}>
                <CustomButton
                    title={t("Return to homepage")}
                    onPress={() => router.replace('/host/(tabs)' as any)}
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View>
        </SafeAreaView>
    );
}

const successStyles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20)
    },
    scroll: {
        paddingBottom: hp(100)
    },
    iconCircle: {
        alignSelf: 'center',
        width: wp(72), height: wp(72),
        borderRadius: wp(36),
        backgroundColor: Colors.COLOR_ACTIVE,
        alignItems: 'center', justifyContent: 'center',
        marginTop: hp(8),
    },
    successDesc: { marginTop: hp(8), marginBottom: hp(24), lineHeight: hp(22) },
    section: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(12),
    },
    label: { marginBottom: hp(10), letterSpacing: 0.6 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: hp(8) },
    infoLeft: { flexDirection: 'row', alignItems: 'center', gap: wp(8) },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
    footer: {
        // position: 'absolute', bottom: 0, left: 0, right: 0,
        // padding: wp(20),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1, borderColor: Colors.BORDER_COLOR,
    },
});