import { useFormat } from '@/lib/useFormat';
import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body6, Body7, Caption2, Caption3 } from '@/components/typo/Typography';
import { showToast } from '@/components/shared/Toast';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { formatClock } from '@/lib/datetime';

import { accommodationPhoto, personName } from '@/lib/mappers';
import { computeSchedulePrice, fromCents } from '@/lib/pricing';

import { usePlatformFeePercent } from '@/redux/services/miscApi';
import { usePayForScheduleMutation } from '@/redux/services/paymentApi';
import {
    useGetScheduleByIdQuery,
    useInitiateHandCashMutation,
} from '@/redux/services/scheduleApi';
import { initStripe, useStripe } from '@stripe/stripe-react-native';
import { AppImage } from '@/components/shared/AppImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

// Cards go through Stripe's payment sheet; cash is settled outside Stripe and
// only needs the cleaner's approval. No wallet rails are offered.
type PaymentMethod = 'card' | 'hand_cash';

function RadioButton({ selected }: { selected: boolean }) {
    return (
        <View style={[payStyles.radio, selected && payStyles.radioSelected]}>
            {selected && <View style={payStyles.radioDot} />}
        </View>
    );
}

function PaymentOption({
    method,
    label,
    icon,
    rightIcons,
    selected,
    onPress,
}: {
    method: PaymentMethod;
    label: string;
    icon?: React.ReactNode;
    rightIcons?: React.ReactNode;
    selected: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable style={payStyles.payOption} onPress={onPress}>
            <RadioButton selected={selected} />
            {icon}
            <Body6 color={Colors.PRIMARY_TEXT} style={{ flex: 1 }}>{label}</Body6>
            {rightIcons}
        </Pressable>
    );
}

export default function PaymentScreen() {
    const t = useT();
    const { formatDate, formatMoney } = useFormat();
    const router = useRouter();
    const { scheduleId } = useLocalSearchParams<{ scheduleId: string }>();
    const [selected, setSelected] = useState<PaymentMethod>('card');

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const { data: schedule, isLoading } = useGetScheduleByIdQuery(scheduleId, {
        skip: !scheduleId,
    });
    const [payForSchedule, { isLoading: isPaying }] = usePayForScheduleMutation();
    const [initiateHandCash, { isLoading: isRequestingCash }] = useInitiateHandCashMutation();
    const feePercent = usePlatformFeePercent();

    const accommodation = (schedule?.accommodation ?? {}) as any;
    const cleaner = (schedule?.cleaner ?? {}) as any;
    const assignment = schedule?.assignment as any;

    const price = useMemo(
        () =>
            computeSchedulePrice(
                assignment?.pricePerCleaning,
                accommodation?.cleaningRate,
                feePercent,
            ),
        [assignment, accommodation, feePercent],
    );

    const data = useMemo(
        () => ({
            apartmentName: accommodation?.name ?? '',
            apartmentImage: accommodationPhoto(accommodation),
            address: [accommodation?.address, accommodation?.zipCode, accommodation?.city]
                .filter(Boolean)
                .join('\n'),
            date: formatDate(schedule?.date, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
            checkOut: formatClock(schedule?.checkOutTime),
            checkIn: formatClock(schedule?.checkInTime),
            housekeeper: personName(cleaner, 'Cleaner'),
            cleaningService: price.cleaningService,
            serviceFee: price.serviceFee,
        }),
        [accommodation, schedule, cleaner, price],
    );

    const total = price.total;

    const goToSuccess = (paidTotal: number, method: PaymentMethod) =>
        router.replace({
            pathname: '/host/payment/payment_success',
            params: { scheduleId, total: String(paidTotal), method },
        } as any);

    const handleConfirm = async () => {
        if (!scheduleId) return;

        // Settling in cash needs no card: the backend asks the cleaner to
        // approve, and the job proceeds outside Stripe.
        if (selected === 'hand_cash') {
            try {
                await initiateHandCash(scheduleId).unwrap();
                showToast(t("Cash payment requested — waiting for the cleaner."), 'success');
                goToSuccess(total, selected);
            } catch (err) {
                showToast(getApiErrorMessage(err, t("Could not request cash payment.")), 'error');
            }
            return;
        }

        try {
            // 1. Create the escrow PaymentIntent (money is held until the host
            //    validates the cleaning, then released to the cleaner).
            const intent = await payForSchedule(scheduleId).unwrap();

            // 2. The key belongs to the backend's Stripe account, so use the
            //    one it just handed us rather than trusting the build env.
            await initStripe({ publishableKey: intent.publishableKey });

            // 3. Build the card sheet. No applePay/googlePay config is passed,
            //    so Stripe presents card entry only.
            const { error: initError } = await initPaymentSheet({
                merchantDisplayName: 'Gestlio',
                paymentIntentClientSecret: intent.paymentIntentClientSecret,
                customerId: intent.customerId,
                customerEphemeralKeySecret: intent.ephemeralKey,
                allowsDelayedPaymentMethods: false,
            });
            if (initError) {
                showToast(initError.message, 'error');
                return;
            }

            // 4. Present it. A user-cancelled sheet is not an error worth a
            //    red toast — they are simply back on this screen.
            const { error: sheetError } = await presentPaymentSheet();
            if (sheetError) {
                if (sheetError.code !== 'Canceled') {
                    showToast(sheetError.message, 'error');
                }
                return;
            }

            goToSuccess(fromCents(intent.amount), selected);
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Payment could not be started.")), 'error');
        }
    };

    if (isLoading && !schedule) {
        return (
            <SafeAreaView style={[payStyles.safe, { paddingTop: hp(16) }]}>
                <SkeletonDetail />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={payStyles.safe}>
            <SectionTitle title={t("Payment")} />
            <ScrollView contentContainerStyle={payStyles.scroll} showsVerticalScrollIndicator={false}>

                {/* Accommodation card */}
                <View style={payStyles.section}>
                    <View style={payStyles.accomRow}>
                        <AppImage source={data.apartmentImage} style={payStyles.thumb} contentFit="cover" />
                        <View style={{ flex: 1 }}>
                            <Caption2 color="#8E8E93" style={payStyles.label}>{t("ACCOMMODATION")}</Caption2>
                            <Caption2 color={Colors.PRIMARY_TEXT}>{data.apartmentName}</Caption2>
                            <View style={payStyles.addressRow}>
                                <View style={{ marginTop: hp(5) }}>
                                    <LocationIcon size={20} color={"#727272"} />
                                </View>
                                <Caption3 color={"#727272"}>{data.address}</Caption3>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Booking info */}
                <View style={payStyles.section}>
                    {[
                        { icon: <CalendarIcon size={18} color={"#8E8E93"} />, label: t("Date"), value: data.date },
                        { icon: <ClockIcon size={14} color={"#8E8E93"} />, label: t("Check-out / Check-in"), value: `${data.checkOut} ➔ ${data.checkIn}` },
                        { icon: <UserIcon size={14} color={"#8E8E93"} />, label: t("Housekeeper"), value: data.housekeeper },
                    ].map((row, idx, arr) => (
                        <React.Fragment key={row.label}>
                            <View style={payStyles.infoRow}>
                                <View style={payStyles.infoLeft}>
                                    {row.icon}
                                    <Caption3 color={"#8E8E93"}>{row.label}</Caption3>
                                </View>
                                <Caption3 color={Colors.PRIMARY_TEXT}>{row.value}</Caption3>
                            </View>
                            {/* {idx < arr.length - 1 && <View style={payStyles.divider} />} */}
                        </React.Fragment>
                    ))}
                </View>

                {/* Price details */}
                <View style={payStyles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={payStyles.label}>{t("PRICE DETAILS")}</Caption2>
                    <View style={payStyles.infoRow}>
                        <Caption3 color={Colors.TEXT_COLOR}>{t("Cleaning Service")}</Caption3>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {formatMoney(data.cleaningService)}
                        </Caption3>
                    </View>
                    {/* <View style={payStyles.divider} /> */}
                    <View style={payStyles.infoRow}>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            Service Fee ({price.feePercent}%)
                        </Caption3>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {formatMoney(data.serviceFee)}
                        </Caption3>
                    </View>
                    {/* <View style={payStyles.divider} /> */}
                    <View style={payStyles.infoRow}>
                        <Body7 color={Colors.PRIMARY_TEXT}>{t("Total to Pay")}</Body7>
                        <Body7 color={Colors.PRIMARY_TEXT}>{formatMoney(total)}</Body7>
                    </View>
                </View>

                {/* Payment method */}
                <View style={payStyles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={payStyles.label}>{t("PAYMENT METHOD")}</Caption2>

                    <PaymentOption
                        method="card"
                        label={t("Card")}
                        selected={selected === 'card'}
                        onPress={() => setSelected('card')}
                        icon={<UserIcon size={18} color={Colors.TEXT_COLOR} />}
                        rightIcons={
                            <View style={{ flexDirection: 'row', gap: wp(4) }}>
                                <AppImage source={IMAGE_COMPONENTS.americanEx} style={payStyles.payIcon} contentFit="contain" />
                                <AppImage source={IMAGE_COMPONENTS.masterCard} style={payStyles.payIcon} contentFit="contain" />
                            </View>
                        }
                    />
                    <PaymentOption
                        method="hand_cash"
                        label={t("Pay in cash")}
                        selected={selected === 'hand_cash'}
                        onPress={() => setSelected('hand_cash')}
                        icon={<UserIcon size={18} color={Colors.TEXT_COLOR} />}
                    />
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={payStyles.footer}>
                <CustomButton
                    title={isPaying || isRequestingCash ? 'Processing...' : 'Confirm & Pay'}
                    disabled={isPaying || isRequestingCash}
                    onPress={handleConfirm}
                    width="100%"
                    backgroundColor={"#0088FF"}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View>
        </SafeAreaView>
    );
}

const payStyles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: { paddingBottom: hp(100) },
    section: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(12),
    },
    label: {
        letterSpacing: 0.8
    },
    accomRow: { flexDirection: 'row', alignItems: 'center', gap: wp(12) },
    thumb: {
        width: wp(100),
        height: wp(100),
        borderRadius: wp(10)
    },
    addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(4), marginTop: hp(4) },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(8) },
    infoLeft: { flexDirection: 'row', alignItems: 'center', gap: wp(8) },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
    payOption: { flexDirection: 'row', alignItems: 'center', gap: wp(12), paddingVertical: hp(14) },
    radio: {
        width: wp(20), height: wp(20), borderRadius: wp(10),
        borderWidth: 2, borderColor: Colors.BORDER_COLOR,
        alignItems: 'center', justifyContent: 'center',
    },
    radioSelected: { borderColor: Colors.COLOR_ACTIVE },
    radioDot: {
        width: wp(10), height: wp(10), borderRadius: wp(5),
        backgroundColor: Colors.COLOR_ACTIVE,
    },
    payIcon: { width: wp(36), height: hp(22) },
    payMethodIcon: { width: wp(44), height: hp(24) },
    footer: {
        // position: 'absolute', bottom: 0, left: 0, right: 0,
        // padding: wp(20),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        //  borderColor: Colors.BORDER_COLOR,
    },
});