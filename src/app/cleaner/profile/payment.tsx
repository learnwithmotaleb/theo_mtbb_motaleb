import { SkeletonText } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { BankIcon } from '@/assets/icons/cleaner_icon/BankIcon';
import { ShieldCheckIcon } from '@/assets/icons/common_icon/ShieldCheckIcon';
import { InfoIcon } from '@/assets/icons/host_icon/InfoIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Body5, Body6, Caption2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { formatDate } from '@/lib/datetime';
import { personName } from '@/lib/mappers';
import { useCurrentUser } from '@/redux/hooks';
import {
    ConnectState,
    ConnectStatus,
    useCreateConnectAccountMutation,
    useGetConnectStatusQuery,
} from '@/redux/services/paymentApi';
import * as WebBrowser from 'expo-web-browser';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

/** Where Stripe's return page sends the cleaner back (see backend /stripe/connect/return). */
const PAYOUT_RETURN_URL = 'gestlio://payouts/return';

type Tone = { bg: string; fg: string };

const TONES: Record<ConnectState, Tone> = {
    not_started: { bg: '#8F8F8F1A', fg: Colors.TEXT_COLOR },
    incomplete: { bg: '#FF8D281A', fg: '#B35A00' },
    pending_verification: { bg: '#0088FF14', fg: Colors.BRAND_PRIMARY },
    restricted: { bg: '#FF383C14', fg: Colors.COLOR_DANGER },
    active: { bg: '#22C55E1A', fg: Colors.SUCCESS_COLOR },
};

const STATE_LABEL: Record<ConnectState, string> = {
    not_started: 'Not started',
    incomplete: 'To complete',
    pending_verification: 'Being verified by Stripe',
    restricted: 'Blocked: contact support',
    active: 'Active',
};

const STATE_TEXT: Record<ConnectState, string> = {
    not_started: 'You have not set up your payouts yet. It takes about 5 minutes.',
    incomplete: 'Some information is still missing. Continue where you left off.',
    pending_verification: 'Stripe is checking your information. This usually takes a few minutes, sometimes up to 2 days.',
    restricted: 'Stripe has suspended your payouts. Complete your file or contact Gestlio support.',
    active: 'Your payouts are active. Payments for validated cleanings are sent to your bank account.',
};

const BUTTON_LABEL: Record<ConnectState, string> = {
    not_started: 'Set up my payouts with Stripe',
    incomplete: 'Continue setup',
    pending_verification: 'View my Stripe file',
    restricted: 'Complete my file',
    active: 'Update my bank details',
};

/** Older backends only send the booleans; derive the same states from them. */
function connectState(status?: ConnectStatus): ConnectState {
    if (status?.status) return status.status;
    if (status?.onboarded) return 'active';
    if (status?.detailsSubmitted) return 'pending_verification';
    return 'not_started';
}

/** Backend sends an ISO 8601 string (or null); Unix seconds/ms tolerated too. */
function deadlineText(value?: number | string | null): string {
    if (value === null || value === undefined || value === '') return '';
    const n = Number(value);
    if (Number.isFinite(n)) return formatDate(new Date(n < 1e12 ? n * 1000 : n));
    return formatDate(String(value));
}

function Step({ index, title, text }: { index: number; title: string; text: string }) {
    return (
        <View style={ribStyles.stepRow}>
            <View style={ribStyles.stepNum}>
                <Caption2 color={Colors.BRAND_PRIMARY}>{index}</Caption2>
            </View>
            <View style={{ flex: 1 }}>
                <Body6 color={Colors.PRIMARY_TEXT}>{title}</Body6>
                <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(2) }}>{text}</Caption3>
            </View>
        </View>
    );
}

export default function CleanerPaymentScreen() {
    const t = useT();
    const me = useCurrentUser();

    // Payouts run through Stripe Connect (Express): the cleaner completes
    // Stripe's hosted onboarding, and the backend mirrors the state here.
    // Always re-read on open: the cleaner may come back from Stripe through
    // gestlio://payouts/return rather than the auth session closing.
    const { data: status, isLoading, refetch } = useGetConnectStatusQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch]),
    );
    const [createConnectAccount, { isLoading: isStarting }] =
        useCreateConnectAccountMutation();

    const state = connectState(status);
    const tone = TONES[state];
    const missingCount = status?.requirementsDue?.length ?? 0;
    const deadline = deadlineText(status?.currentDeadline);

    const handleSetupPayouts = async () => {
        try {
            // Gestlio is a French service: Stripe needs FR for +33, euros and
            // the IBAN form. NOTE: the live Stripe platform is currently a US
            // account, which Stripe refuses for FR connected accounts — this
            // fails until the client connects a French Stripe account.
            const { url } = await createConnectAccount({
                country: (me?.country as string) || 'FR',
            }).unwrap();
            // The auth session closes itself when Stripe's return page opens
            // gestlio://payouts/return. Re-read the status either way.
            await WebBrowser.openAuthSessionAsync(url, PAYOUT_RETURN_URL);
            refetch();
        } catch (err) {
            // 5xx here means the server or its Stripe setup failed (missing
            // config, Connect not enabled, Stripe down). The backend message
            // carries technical diagnostics meant for developers, so the
            // cleaner gets a plain message and the details go to the dev log.
            const status = (err as { status?: unknown })?.status;
            if (typeof status === 'number' && status >= 500) {
                if (__DEV__) console.warn('[payout onboarding]', status, (err as { data?: unknown }).data);
                showToast(t("Payout setup is temporarily unavailable. Please try again later or contact support."), 'error');
                return;
            }
            showToast(getApiErrorMessage(err, t("Could not start payout setup.")), 'error');
        }
    };

    return (
        <SafeAreaView style={ribStyles.safe}>
            <SectionTitle title={t("Payment Methods")} />
            <ScrollView contentContainerStyle={ribStyles.scroll} showsVerticalScrollIndicator={false}>

                {/* Hero */}
                <View style={ribStyles.heroRow}>
                    <View style={ribStyles.heroCircle}>
                        <BankIcon size={32} color={Colors.TEXT_COLOR} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Body5 color={Colors.PRIMARY_TEXT}>
                            {t("Receive your payment into your bank account")}
                        </Body5>
                        <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(4) }}>
                            {t("Hosts pay for each cleaning through Gestlio. The money is sent to your bank account once the cleaning is validated.")}
                        </Caption3>
                    </View>
                </View>

                {/* Stripe, explained before the cleaner is sent there */}
                <View style={ribStyles.stripeBanner}>
                    <View style={ribStyles.stripeIconWrapper}>
                        <ShieldCheckIcon size={20} color={Colors.BRAND_PRIMARY} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Caption2 color={Colors.PRIMARY_TEXT}>
                            {t("Gestlio uses Stripe for secure payments")}
                        </Caption2>
                        <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(4) }}>
                            {t("Stripe is our payment partner, used by millions of businesses. To receive your payouts, the law requires Stripe to verify your identity and your bank account. Your information is held by Stripe, never by Gestlio.")}
                        </Caption3>
                    </View>
                </View>

                {/* Status */}
                <View style={ribStyles.card}>
                    {isLoading ? (
                        <SkeletonText lines={3} />
                    ) : (
                        <>
                            <View style={[ribStyles.statusBadge, { backgroundColor: tone.bg }]}>
                                <View style={[ribStyles.statusDot, { backgroundColor: tone.fg }]} />
                                <Caption2 color={tone.fg}>{t(STATE_LABEL[state])}</Caption2>
                            </View>

                            <Caption2 color={Colors.PRIMARY_TEXT} style={{ marginTop: hp(12) }}>
                                {t("My payout account")}
                            </Caption2>
                            <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(4) }}>
                                {t(STATE_TEXT[state])}
                            </Caption3>

                            <View style={ribStyles.infoRow}>
                                <Caption3 color={Colors.TEXT_COLOR}>{t("Account holder:")}</Caption3>
                                <Body6 color={Colors.PRIMARY_TEXT}>{personName(me, 'You')}</Body6>
                            </View>
                            {!!status?.bankLast4 && (
                                <View style={ribStyles.infoRow}>
                                    <Caption3 color={Colors.TEXT_COLOR}>{t("Bank account")}</Caption3>
                                    <Body6 color={Colors.PRIMARY_TEXT}>IBAN •••• {status.bankLast4}</Body6>
                                </View>
                            )}
                            {state === 'incomplete' && missingCount > 0 && (
                                <View style={ribStyles.infoRow}>
                                    <Caption3 color={Colors.TEXT_COLOR}>{t("Missing information")}</Caption3>
                                    <Body6 color={Colors.PRIMARY_TEXT}>{missingCount}</Body6>
                                </View>
                            )}
                            {!!deadline && state !== 'active' && (
                                <View style={ribStyles.infoRow}>
                                    <Caption3 color={Colors.TEXT_COLOR}>{t("To complete before")}</Caption3>
                                    <Body6 color={Colors.PRIMARY_TEXT}>{deadline}</Body6>
                                </View>
                            )}
                        </>
                    )}

                    <Pressable
                        style={[
                            ribStyles.primaryBtn,
                            state === 'active' && ribStyles.secondaryBtn,
                            isStarting && { opacity: 0.6 },
                        ]}
                        onPress={handleSetupPayouts}
                        disabled={isStarting || isLoading}
                        accessibilityRole="button"
                    >
                        <Body6 color={state === 'active' ? Colors.PRIMARY_TEXT : Colors.TEXT_WHITE}>
                            {isStarting ? t("Opening...") : t(BUTTON_LABEL[state])}
                        </Body6>
                    </Pressable>
                    <Caption3 color={Colors.TEXT_COLOR} style={ribStyles.redirectNote}>
                        {t("You will be redirected to Stripe's secure page, then brought back to Gestlio automatically.")}
                    </Caption3>
                </View>

                {/* What to prepare */}
                {state !== 'active' && (
                    <View style={ribStyles.card}>
                        <Caption2 color={Colors.PRIMARY_TEXT}>
                            {t("What you will need (about 5 minutes)")}
                        </Caption2>
                        <Step
                            index={1}
                            title={t("Your contact details")}
                            text={t("Email and mobile number (+33). We fill in what we already know.")}
                        />
                        <Step
                            index={2}
                            title={t("Your identity and address")}
                            text={t("Date of birth, home address and, if Stripe asks, a photo of your ID card or passport.")}
                        />
                        <Step
                            index={3}
                            title={t("Your bank details (IBAN)")}
                            text={t("The IBAN shown on your RIB, starting with FR76. This is where your payouts are sent.")}
                        />
                    </View>
                )}

                {/* Why */}
                <View style={ribStyles.infoCard}>
                    <View style={ribStyles.infoIconWrapper}>
                        <InfoIcon size={18} color={Colors.TEXT_COLOR} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Caption2 color={Colors.PRIMARY_TEXT}>
                            {t("Why set up payouts?")}
                        </Caption2>
                        <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(4) }}>
                            {t("Hosts pay into escrow and the money is released to you once a cleaning is validated. Until payouts are set up, hosts cannot pay for your missions.")}
                        </Caption3>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const ribStyles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
    scroll: { paddingBottom: hp(40) },

    // Hero
    heroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(16),
        marginVertical: hp(20),
    },
    heroCircle: {
        width: wp(72),
         height: wp(72),
        borderRadius: wp(36),
        backgroundColor: "#b640401a",
        alignItems: 'center',
         justifyContent: 'center',
    },

    // RIB card
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(16),
    },


    // Status
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(6),
        alignSelf: 'flex-start',
        borderRadius: wp(20),
        paddingHorizontal: wp(10),
        paddingVertical: hp(4),
    },
    statusDot: { width: wp(8), height: wp(8), borderRadius: wp(4) },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: wp(12),
        marginTop: hp(12),
        paddingTop: hp(12),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Colors.BORDER_COLOR,
    },
    primaryBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(18),
        padding: hp(14),
        backgroundColor: Colors.BRAND_PRIMARY,
        borderRadius: wp(100),
    },
    secondaryBtn: {
        backgroundColor: '#8F8F8F1A',
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    redirectNote: { marginTop: hp(8), textAlign: 'center' },

    // Steps
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(12),
        marginTop: hp(14),
    },
    stepNum: {
        width: wp(26),
        height: wp(26),
        borderRadius: wp(13),
        backgroundColor: '#0088FF14',
        alignItems: 'center',
        justifyContent: 'center',
    },


    // Info card
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(12),
        padding: wp(16),
        backgroundColor: "#8F8F8F1A",
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
    infoIconWrapper: {
        width: wp(32), height: wp(32),
        borderRadius: wp(16),
        backgroundColor: Colors.BORDER_COLOR,
        alignItems: 'center', justifyContent: 'center',
    },

    // Stripe banner
    stripeBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(12),
        padding: wp(16),
        backgroundColor: "#0088FF14",
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: "#0088FF33",
        marginBottom: hp(16),
    },
    stripeIconWrapper: {
        width: wp(36), height: wp(36),
        borderRadius: wp(18),
        backgroundColor: "#0088FF1A",
        alignItems: 'center', justifyContent: 'center',
    },
});