import { useFormat } from '@/lib/useFormat';
import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import { MoneyBagIcon } from '@/assets/icons/common_icon/MoneyBagIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { InfoIcon } from '@/assets/icons/common_icon/InfoIcon';
import { AppImage } from '@/components/shared/AppImage';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Body6, Body7, Caption2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { cleaningWindow, formatDayKey } from '@/lib/datetime';
import { accommodationPhoto, personName } from '@/lib/mappers';
import { computeSchedulePrice, isSchedulePaid } from '@/lib/pricing';
import { useAppDispatch } from '@/redux/hooks';
import { accommodationApi, useGetAccommodationByIdQuery } from '@/redux/services/accommodationApi';
import { useGetAccommodationCleanersQuery } from '@/redux/services/assignmentApi';
import { useGetPublicSettingsQuery } from '@/redux/services/miscApi';
import { usePayForScheduleMutation } from '@/redux/services/paymentApi';
import {
    scheduleApi,
    useCreateScheduleMutation,
    useGetScheduleByIdQuery,
    useInitiateHandCashMutation,
} from '@/redux/services/scheduleApi';
import { initStripe, PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

/**
 * Two steps, one screen:
 *  - Booking (no `scheduleId`): a summary of the request. « Envoyer la
 *    demande » creates it — the only moment the cleaner is asked. Nothing is
 *    paid yet: the backend only takes payment once the cleaner has accepted.
 *  - Payment (`scheduleId` of an accepted cleaning): card through Stripe when
 *    the cleaner can receive payouts, or payment outside the app.
 */
type PaymentMethod = 'card' | 'hand_cash';

type PaymentParams = {
    scheduleId?: string;
    accommodationId?: string;
    cleanerId?: string;
    date?: string;
    arrival?: string;
    departure?: string;
    notes?: string;
};

/** Brings the cleaner back after 3-D Secure (see app/stripe-redirect.tsx). */
const STRIPE_RETURN_URL = 'gestlio://stripe-redirect';

function RadioButton({ selected, disabled }: { selected: boolean; disabled?: boolean }) {
    return (
        <View style={[payStyles.radio, selected && payStyles.radioSelected, disabled && { opacity: 0.4 }]}>
            {selected && <View style={payStyles.radioDot} />}
        </View>
    );
}

function PaymentOption({
    label,
    description,
    icon,
    selected,
    disabled,
    onPress,
}: {
    label: string;
    description: string;
    icon?: React.ReactNode;
    selected: boolean;
    disabled?: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            style={[payStyles.payOption, selected && payStyles.payOptionSelected, disabled && { opacity: 0.5 }]}
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
        >
            <RadioButton selected={selected} disabled={disabled} />
            {icon}
            <View style={{ flex: 1 }}>
                <Body6 color={Colors.PRIMARY_TEXT}>{label}</Body6>
                <Caption3 color={'#727272'} style={{ marginTop: hp(2) }}>{description}</Caption3>
            </View>
        </Pressable>
    );
}

export default function PaymentScreen() {
    const t = useT();
    const { formatDate, formatMoney } = useFormat();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const params = useLocalSearchParams<PaymentParams>();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const isDraft = !params.scheduleId;
    const accommodationId = params.accommodationId ?? '';

    // Existing cleaning: everything comes from the schedule (re-read on open,
    // the backend re-checks the cleaner's Stripe status there).
    const { data: schedule, isLoading: isLoadingSchedule, refetch: refetchSchedule } =
        useGetScheduleByIdQuery(params.scheduleId ?? '', {
            skip: !params.scheduleId,
            refetchOnMountOrArgChange: true,
        });
    // New request: the property and the cleaner's assignment (for the price).
    const { data: draftAccommodation, isLoading: isLoadingAccommodation } =
        useGetAccommodationByIdQuery(accommodationId, { skip: !isDraft || !accommodationId });
    const { data: assignments } = useGetAccommodationCleanersQuery(accommodationId, {
        skip: !isDraft || !accommodationId,
    });
    const { data: settings } = useGetPublicSettingsQuery();

    const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation();
    const [initiateHandCash, { isLoading: isRequestingCash }] = useInitiateHandCashMutation();
    const [payForSchedule, { isLoading: isCreatingIntent }] = usePayForScheduleMutation();
    const [isPresentingSheet, setPresentingSheet] = useState(false);
    const isSubmitting = isCreating || isRequestingCash || isCreatingIntent || isPresentingSheet;
    // Set synchronously: two quick taps must never send two requests.
    const submittingRef = useRef(false);

    const draftAssignment = useMemo(
        () =>
            (assignments ?? []).find((a) => {
                const c = a.cleaner as any;
                return a.status === 'accepted' && (c?._id === params.cleanerId || a._id === params.cleanerId);
            }) ?? null,
        [assignments, params.cleanerId],
    );

    const accommodation = useMemo(
        () => ((isDraft ? draftAccommodation : schedule?.accommodation) ?? {}) as any,
        [isDraft, draftAccommodation, schedule],
    );
    const cleaner = useMemo(
        () => ((isDraft ? draftAssignment?.cleaner : schedule?.cleaner) ?? {}) as any,
        [isDraft, draftAssignment, schedule],
    );
    const assignment = (isDraft ? draftAssignment : schedule?.assignment) as any;

    // Backend field: Stripe account exists and payouts are enabled.
    const canPayByCard = cleaner?.canReceivePayments === true;
    const isAccepted = ['accepted', 'in_progress'].includes(String(schedule?.status ?? ''));
    const isPaid = isSchedulePaid(schedule?.paymentStatus);
    const isHandcashPending = schedule?.paymentStatus === 'handcash_pending';
    const canPay = !isDraft && isAccepted && schedule?.paymentStatus === 'unpaid';

    const [pickedMethod, setPickedMethod] = useState<PaymentMethod | null>(null);
    const method: PaymentMethod = pickedMethod ?? (canPayByCard ? 'card' : 'hand_cash');

    // Shown before paying; the exact amount comes from the server when the
    // card payment starts (and is what Stripe's sheet displays).
    const price = useMemo(
        () =>
            computeSchedulePrice(
                assignment?.pricePerCleaning,
                accommodation?.cleaningRate,
                method === 'card' ? settings?.platformCommission : 0,
            ),
        [assignment, accommodation, settings, method],
    );

    const data = useMemo(
        () => ({
            apartmentName: accommodation?.name ?? '',
            apartmentImage: accommodationPhoto(accommodation),
            address: [accommodation?.address, accommodation?.zipCode, accommodation?.city]
                .filter(Boolean)
                .join('\n'),
            date: isDraft
                ? formatDayKey(params.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                : formatDate(schedule?.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
            slot: isDraft
                ? cleaningWindow(params.arrival, params.departure)
                : cleaningWindow(schedule?.checkInTime, schedule?.checkOutTime),
            housekeeper: personName(cleaner, t('Housekeeper')),
        }),
        [accommodation, schedule, cleaner, t, formatDate, isDraft, params.date, params.arrival, params.departure],
    );

    const refreshLists = () => {
        dispatch(accommodationApi.util.invalidateTags(['Accommodation', 'HostDashboard', 'Calendar']));
        dispatch(scheduleApi.util.invalidateTags(['Schedule', 'Calendar', 'HostDashboard', 'Payment']));
    };

    // ── Step 1: send the request (the only place a cleaner is asked) ────────
    const sendRequest = async () => {
        if (!accommodationId || !params.cleanerId || !params.date || !params.arrival || !params.departure) {
            showToast(t('Could not create the schedule.'), 'error');
            return;
        }
        try {
            const created = await createSchedule({
                accommodationId,
                cleanerId: params.cleanerId,
                date: params.date,
                // Guest check-out = cleaner arrives; next check-in = the
                // cleaner leaves (convention shared by every booking screen).
                checkOutTime: params.arrival,
                checkInTime: params.departure,
                notes: params.notes || undefined,
            }).unwrap();
            refreshLists();
            router.replace({
                pathname: '/host/payment/payment_success',
                params: { scheduleId: created._id, method: 'request' },
            } as any);
        } catch (err) {
            showToast(getApiErrorMessage(err, t('Could not create the schedule.')), 'error');
        }
    };

    // ── Step 2a: card through Stripe's payment sheet ────────────────────────
    const payByCard = async (scheduleId: string) => {
        let intent;
        try {
            intent = await payForSchedule(scheduleId).unwrap();
        } catch (err) {
            showToast(getApiErrorMessage(err, t('Could not start the payment.')), 'error');
            refetchSchedule();
            return;
        }

        setPresentingSheet(true);
        try {
            // The key travels with the intent, so it always matches the
            // server's environment (test now, live later).
            await initStripe({ publishableKey: intent.publishableKey, urlScheme: 'gestlio' });
            const init = await initPaymentSheet({
                merchantDisplayName: 'Gestlio',
                customerId: intent.customerId,
                customerEphemeralKeySecret: intent.ephemeralKey,
                paymentIntentClientSecret: intent.paymentIntentClientSecret,
                returnURL: STRIPE_RETURN_URL,
                defaultBillingDetails: { address: { country: 'FR' } },
            });
            if (init.error) {
                showToast(init.error.localizedMessage || init.error.message || t('Could not start the payment.'), 'error');
                return;
            }
            const result = await presentPaymentSheet();
            if (result.error) {
                if (result.error.code === PaymentSheetError.Canceled) {
                    showToast(t('Payment cancelled. Nothing was charged.'), 'info');
                } else {
                    showToast(result.error.localizedMessage || result.error.message || t('The payment failed.'), 'error');
                }
                return;
            }
        } finally {
            setPresentingSheet(false);
        }

        // Confirmed by the backend webhook within seconds; GET /schedule/:id
        // also checks Stripe directly, so the success screen re-reads it.
        refreshLists();
        router.replace({
            pathname: '/host/payment/payment_success',
            params: {
                scheduleId,
                method: 'card',
                total: String((intent.amount ?? 0) / 100),
                currency: intent.currency ?? 'eur',
            },
        } as any);
    };

    // ── Step 2b: settled outside the app ────────────────────────────────────
    const payOutsideApp = async (scheduleId: string) => {
        try {
            await initiateHandCash(scheduleId).unwrap();
        } catch (err) {
            showToast(getApiErrorMessage(err, t('Could not record the payment method.')), 'error');
            refetchSchedule();
            return;
        }
        refreshLists();
        router.replace({
            pathname: '/host/payment/payment_success',
            params: { scheduleId, method: 'hand_cash' },
        } as any);
    };

    const handleConfirm = async () => {
        if (submittingRef.current) return;
        submittingRef.current = true;
        try {
            if (isDraft) await sendRequest();
            else if (params.scheduleId && canPay) {
                if (method === 'card') await payByCard(params.scheduleId);
                else await payOutsideApp(params.scheduleId);
            }
        } finally {
            submittingRef.current = false;
        }
    };

    const isLoading = isDraft ? isLoadingAccommodation : isLoadingSchedule;
    const hasContent = isDraft ? Boolean(draftAccommodation) : Boolean(schedule);

    if (isLoading && !hasContent) {
        return (
            <SafeAreaView style={[payStyles.safe, { paddingTop: hp(16) }]}>
                <SkeletonDetail />
            </SafeAreaView>
        );
    }

    const buttonTitle = isDraft
        ? isSubmitting ? t('Sending the request...') : t('Send the request')
        : isSubmitting
          ? t('Processing...')
          : method === 'card'
            ? t('Pay {amount} by card', { amount: formatMoney(price.total) })
            : t('Confirm off-app payment');

    // Nothing to do on an existing cleaning that is paid or not yet accepted.
    const showFooter = isDraft || canPay;

    return (
        <SafeAreaView style={payStyles.safe}>
            <SectionTitle title={isDraft ? t('Summary') : t('Payment')} />
            <ScrollView contentContainerStyle={payStyles.scroll} showsVerticalScrollIndicator={false}>

                {/* Accommodation card */}
                <View style={payStyles.section}>
                    <View style={payStyles.accomRow}>
                        <AppImage source={data.apartmentImage} style={payStyles.thumb} contentFit="cover" />
                        <View style={{ flex: 1 }}>
                            <Caption2 color="#8E8E93" style={payStyles.label}>{t('ACCOMMODATION')}</Caption2>
                            <Caption2 color={Colors.PRIMARY_TEXT}>{data.apartmentName}</Caption2>
                            <View style={payStyles.addressRow}>
                                <View style={{ marginTop: hp(5) }}>
                                    <LocationIcon size={20} color={'#727272'} />
                                </View>
                                <Caption3 color={'#727272'}>{data.address}</Caption3>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Booking info */}
                <View style={payStyles.section}>
                    {[
                        { icon: <CalendarIcon size={18} color={'#8E8E93'} />, label: t('Date'), value: data.date },
                        { icon: <ClockIcon size={14} color={'#8E8E93'} />, label: t('Arrival / Departure'), value: [data.slot.arrival, data.slot.departure].filter(Boolean).join(' ➔ ') },
                        { icon: <UserIcon size={14} color={'#8E8E93'} />, label: t('Housekeeper'), value: data.housekeeper },
                    ].map((row) => (
                        <View key={row.label} style={payStyles.infoRow}>
                            <View style={payStyles.infoLeft}>
                                {row.icon}
                                <Caption3 color={'#8E8E93'}>{row.label}</Caption3>
                            </View>
                            <Caption3 color={Colors.PRIMARY_TEXT}>{row.value}</Caption3>
                        </View>
                    ))}
                </View>

                {/* Price details */}
                <View style={payStyles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={payStyles.label}>{t('PRICE DETAILS')}</Caption2>
                    <View style={payStyles.infoRow}>
                        <Caption3 color={Colors.TEXT_COLOR}>{t('Cleaning Service')}</Caption3>
                        <Caption3 color={Colors.TEXT_COLOR}>{formatMoney(price.cleaningService)}</Caption3>
                    </View>
                    {!isDraft && (
                        <View style={payStyles.infoRow}>
                            <Caption3 color={Colors.TEXT_COLOR}>
                                {method === 'card' && price.feePercent
                                    ? t('Service fee ({n}%)', { n: price.feePercent })
                                    : t('Service Fee')}
                            </Caption3>
                            <Caption3 color={Colors.TEXT_COLOR}>{formatMoney(price.serviceFee)}</Caption3>
                        </View>
                    )}
                    <View style={payStyles.infoRow}>
                        <Body7 color={Colors.PRIMARY_TEXT}>{isDraft ? t('Cleaning price') : t('Total to Pay')}</Body7>
                        <Body7 color={Colors.PRIMARY_TEXT}>{formatMoney(price.total)}</Body7>
                    </View>
                </View>

                {isDraft ? (
                    // Booking: explain when and how payment happens.
                    <View style={payStyles.noticeBox}>
                        <InfoIcon size={18} color="#0088FF" />
                        <View style={{ flex: 1 }}>
                            <Caption2 color={Colors.PRIMARY_TEXT}>{t('No payment now')}</Caption2>
                            <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(4) }}>
                                {t('Your request is sent to {name}. Once they accept, you will receive a notification to pay, by card or outside the app.', { name: data.housekeeper })}
                            </Caption3>
                        </View>
                    </View>
                ) : isPaid ? (
                    <View style={[payStyles.noticeBox, payStyles.successBox]}>
                        <Caption2 color={Colors.SUCCESS_COLOR}>✓ {t('Paid')}</Caption2>
                        <Caption3 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>
                            {schedule?.paymentStatus === 'paid_handcash'
                                ? t('Settled directly with the cleaner.')
                                : t('The amount is held securely by Stripe and paid to the cleaner once you validate the cleaning.')}
                        </Caption3>
                    </View>
                ) : isHandcashPending ? (
                    <View style={payStyles.noticeBox}>
                        <InfoIcon size={18} color="#0088FF" />
                        <Caption3 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>
                            {t('You chose to pay outside the app. Settle the cleaning directly with the cleaner.')}
                        </Caption3>
                    </View>
                ) : !isAccepted ? (
                    <View style={payStyles.noticeBox}>
                        <InfoIcon size={18} color="#0088FF" />
                        <Caption3 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>
                            {t('Payment opens once {name} has accepted the request.', { name: data.housekeeper })}
                        </Caption3>
                    </View>
                ) : (
                    <View style={payStyles.section}>
                        <Caption2 color={Colors.TEXT_COLOR} style={payStyles.label}>{t('PAYMENT METHOD')}</Caption2>

                        <PaymentOption
                            label={t('Card payment')}
                            description={
                                canPayByCard
                                    ? t('Secure payment by Stripe. The amount is held and paid to the cleaner once you validate the cleaning.')
                                    : t('Unavailable: {name} has not finished setting up payouts yet.', { name: data.housekeeper })
                            }
                            icon={<MoneyBagIcon size={18} color={Colors.TEXT_COLOR} />}
                            selected={method === 'card'}
                            disabled={!canPayByCard}
                            onPress={() => setPickedMethod('card')}
                        />
                        <PaymentOption
                            label={t('Off-app payment')}
                            description={t('You settle the cleaning directly with the cleaner. Nothing is charged in the app.')}
                            icon={<UserIcon size={18} color={Colors.TEXT_COLOR} />}
                            selected={method === 'hand_cash'}
                            onPress={() => setPickedMethod('hand_cash')}
                        />
                    </View>
                )}
            </ScrollView>

            {showFooter && (
                <View style={payStyles.footer}>
                    <CustomButton
                        title={buttonTitle}
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        onPress={handleConfirm}
                        width="100%"
                        backgroundColor={'#0088FF'}
                        color="#fff"
                        borderRadius={wp(8)}
                        height={hp(52)}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const payStyles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    noticeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        backgroundColor: '#F0F8FF',
        borderRadius: wp(10),
        borderWidth: 1,
        borderColor: '#B8E0FF',
        padding: wp(12),
        marginVertical: hp(10),
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
    payOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        padding: wp(12),
        marginTop: hp(10),
        borderRadius: wp(10),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    payOptionSelected: { borderColor: Colors.COLOR_ACTIVE, backgroundColor: '#22C55E0D' },
    successBox: { backgroundColor: '#22C55E14', borderColor: '#22C55E40' },
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