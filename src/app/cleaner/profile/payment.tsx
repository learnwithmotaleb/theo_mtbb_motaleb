import { SkeletonText } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { BankIcon } from '@/assets/icons/cleaner_icon/BankIcon';
import { CopyIcon } from '@/assets/icons/cleaner_icon/CopyIcon';
import { EditPenIcon } from '@/assets/icons/common_icon/EditPenIcon';
import { StepIndecatorFillIcon } from '@/assets/icons/common_icon/StepIndecatorFillIcon';
import { InfoIcon } from '@/assets/icons/host_icon/InfoIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Body5, Body6, Caption2, Caption3, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { personName } from '@/lib/mappers';
import { useCurrentUser } from '@/redux/hooks';
import {
    useCreateConnectAccountMutation,
    useGetConnectStatusQuery,
} from '@/redux/services/paymentApi';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function CopyField({ label, value }: { label: string; value: string }) {
    return (
        <View style={ribStyles.fieldBlock}>
            <Caption3 color={Colors.TEXT_COLOR}>{label}</Caption3>
            <View style={ribStyles.fieldRow}>
                <Body6 color={Colors.PRIMARY_TEXT} style={{ flex: 1 }}>{value}</Body6>
                <Pressable onPress={() => Clipboard.setStringAsync(value)} hitSlop={8}>
                    <CopyIcon size={18} color={Colors.TEXT_COLOR} />
                </Pressable>
            </View>
        </View>
    );
}

export default function CleanerPaymentScreen() {
    const t = useT();
    const me = useCurrentUser();

    // Payouts run through Stripe Connect: the cleaner completes Stripe's own
    // hosted onboarding, and the backend mirrors the resulting state here.
    const { data: status, isLoading, refetch } = useGetConnectStatusQuery();
    const [createConnectAccount, { isLoading: isStarting }] =
        useCreateConnectAccountMutation();

    const onboarded = status?.onboarded ?? false;

    const handleSetupPayouts = async () => {
        try {
            const { url } = await createConnectAccount({
                country: (me?.country as string) || undefined,
            }).unwrap();
            // Stripe hosts the form; when the browser closes we re-read the
            // status rather than trusting the redirect.
            await WebBrowser.openBrowserAsync(url);
            refetch();
        } catch (err) {
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
                            {t("Add and manage your bank account securely")}
                        </Caption3>
                    </View>
                </View>

                {/* Payout account */}
                <View style={ribStyles.card}>
                    <View style={ribStyles.primaryBadge}>
                        <View style={ribStyles.badgeCheck}>
                            <StepIndecatorFillIcon color={onboarded ? '#34C759' : '#8E8E93'} />
                        </View>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {onboarded ? 'PAYOUTS ACTIVE' : 'PAYOUTS NOT SET UP'}
                        </Caption3>
                    </View>

                    <Caption2 color={Colors.PRIMARY_TEXT} style={{ marginTop: hp(12) }}>
                        {t("My payout account")}
                    </Caption2>

                    <Caption5 color={Colors.TEXT_COLOR} style={{ marginTop: hp(8) }}>
                        {t("Account holder:")}
                    </Caption5>
                    <Body5 color={Colors.TEXT_COLOR}>{personName(me, 'You')}</Body5>

                    {isLoading ? (
                        <SkeletonText lines={4} />
                    ) : (
                        <>
                            <CopyField
                                label={t("Details submitted")}
                                value={status?.detailsSubmitted ? 'Yes' : 'No'}
                            />
                            <CopyField
                                label={t("Payouts enabled")}
                                value={status?.payoutsEnabled ? 'Yes' : 'No'}
                            />
                        </>
                    )}

                    <Pressable
                        style={ribStyles.modifyBtn}
                        onPress={handleSetupPayouts}
                        disabled={isStarting}
                    >
                        <EditPenIcon size={16} color={Colors.TEXT_COLOR} />
                        <Body6 color={Colors.TEXT_COLOR}>
                            {isStarting
                                ? 'Opening...'
                                : onboarded
                                  ? 'Update my payout details'
                                  : 'Set up payouts'}
                        </Body6>
                    </Pressable>
                </View>

                {/* Why add a RIB info card */}
                <View style={ribStyles.infoCard}>
                    <View style={ribStyles.infoIconWrapper}>
                        <InfoIcon size={18} color={Colors.TEXT_COLOR} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Caption2 color={Colors.PRIMARY_TEXT}>
                            {t("Why set up payouts?")}
                        </Caption2>
                        <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(4) }}>
                            {t("Hosts pay into escrow and the money is released to you once a cleaning is validated. Until payouts are set up, hosts cannot pay for your missions. Your bank details are held by Stripe, never by this app.")}
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
    primaryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(6),
        alignSelf: 'flex-start',
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        borderRadius: wp(20),
        paddingHorizontal: wp(10),
        paddingVertical: hp(4),
        backgroundColor: "#8F8F8F1A"
    },
    badgeCheck: {
        width: wp(16), height: wp(16),
        borderRadius: wp(8),
        backgroundColor: Colors.BORDER_COLOR,
        alignItems: 'center', justifyContent: 'center',
    },

    // Fields
    fieldBlock: { marginTop: hp(16) },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(6),
        padding: wp(12),
        backgroundColor: "#8F8F8F1A",
        borderRadius: wp(10),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },

    // Modify button
    modifyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(8),
        marginTop: hp(16),
        padding: hp(14),
        backgroundColor: "#8F8F8F1A",
        borderRadius: wp(10),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
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
});