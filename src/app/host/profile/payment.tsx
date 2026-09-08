import { useFormat } from '@/lib/useFormat';
import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { CreditCardIcon } from '@/assets/icons/host_icon/CreditCardIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body6, Caption3, Caption5 } from '@/components/typo/Typography';
import { fromCents } from '@/lib/pricing';
import { useGetMyPaymentsQuery } from '@/redux/services/paymentApi';

// ── Other method row ──────────────────────────────────────────────────────────
function OtherRow({
    icon,
    name,
    description,
    showDivider,
    onPress,
}: {
    icon: React.ReactNode;
    name: string;
    description: string;
    showDivider: boolean;
    onPress: () => void;
}) {
    return (
        <>
            <Pressable style={styles.row} onPress={onPress}>
                <View style={styles.cardLogo}>{icon}</View>
                <View style={styles.rowInfo}>
                    <Body6 color={Colors.PRIMARY_TEXT}>{name}</Body6>
                    <Caption5 color={Colors.TEXT_COLOR}>{description}</Caption5>
                </View>
                <RightAngleIcon size={28} color={Colors.TEXT_COLOR} />
            </Pressable>
            {/* {showDivider && <View style={styles.divider} />} */}
        </>
    );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function PaymentMethodsScreen() {
    const t = useT();
    const { formatDate, formatMoney } = useFormat();
    const router = useRouter();

    const { data, isLoading } = useGetMyPaymentsQuery({ page: 1, limit: 20 });

    // /payment/my returns row amounts in Stripe cents (the summary is already
    // in units), so every row goes through fromCents.
    const recent = React.useMemo(
        () =>
            (data?.data ?? []).slice(0, 6).map((payment: any) => ({
                id: payment._id,
                name: payment.accommodation?.name ?? 'Cleaning',
                description: `${formatMoney(
                    fromCents(payment.amount),
                    payment.currency,
                )} · ${formatDate(payment.createdAt, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })}`,
            })),
        [data],
    );

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t("Payment Methods")} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero icon */}
                <View style={styles.heroBox}>
                    <View style={styles.heroCircle}>
                        <CreditCardIcon size={32} color={Colors.STATUS_COLOR} />
                    </View>
                    <Caption3
                        color={Colors.TEXT_COLOR}
                        align="center"
                        style={styles.heroDesc}
                    >
                        {t("Manage your bank cards and other payment methods save to your account.")}
                    </Caption3>
                </View>

                {/* BANK CARDS */}
                <Body1 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                    {t("BANK CARDS")}
                </Body1>
                <View style={styles.card}>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.emptyText}>
                        Your card is entered securely in the Stripe checkout each time you
                        pay for a cleaning — Gestlio never stores it, so there is nothing
                        to manage here.
                    </Caption3>
                </View>

                {/* RECENT PAYMENTS */}
                <Body1 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                    {t("RECENT PAYMENTS")}
                </Body1>
                <View style={styles.card}>
                    {isLoading && !data ? (
                        <SkeletonList count={3} variant="row" />
                    ) : recent.length === 0 ? (
                        <Caption3 color={Colors.TEXT_COLOR} style={styles.emptyText}>
                            {t("You have not paid for a cleaning yet.")}
                        </Caption3>
                    ) : (
                        recent.map((item, idx) => (
                            <OtherRow
                                key={item.id}
                                icon={<CreditCardIcon size={24} color={Colors.TEXT_COLOR} />}
                                name={item.name}
                                description={item.description}
                                showDivider={idx < recent.length - 1}
                                onPress={() => router.push('/host/profile/past_cleaning' as any)}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: {
        paddingBottom: hp(40),
    },
    heroBox: {
        alignItems: 'center',
        marginBottom: hp(28),
        marginTop: hp(8),
    },
    heroCircle: {
        width: wp(80),
        height: wp(80),
        borderRadius: wp(40),
        backgroundColor: "#0088FF1A",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(16),
    },
    heroDesc: {
        paddingHorizontal: wp(20),
        lineHeight: hp(22),
    },
    sectionLabel: {
        letterSpacing: 0.6,
        marginBottom: hp(10),
    },
    emptyText: {
        paddingHorizontal: wp(16),
        paddingVertical: hp(20),
        lineHeight: hp(20),
    },
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
        marginBottom: hp(24),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(16),
        paddingVertical: hp(16),
        gap: wp(14),
        marginBottom:hp(8)
    },
    cardLogo: {
        width: wp(56),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    rowInfo: {
        flex: 1,
        gap: hp(3),
    },
    divider: {
        height: 1,
        backgroundColor: Colors.BORDER_COLOR,
        marginHorizontal: wp(16),
    },
});