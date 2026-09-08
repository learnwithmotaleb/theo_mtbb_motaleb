import { useFormat } from '@/lib/useFormat';
import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { DocumentsIcon } from '@/assets/icons/cleaner_icon/DocumentsIcon';
import { MonthIcon } from '@/assets/icons/cleaner_icon/MonthIcon';
import { DownArrowIcon } from '@/assets/icons/common_icon/DownArrowIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body6, Body7, Caption3, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';


import { useGetRevenueQuery } from '@/redux/services/paymentApi';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function RevenueScreen() {
    const t = useT();
    const { formatDate, formatMoney } = useFormat();
    const router = useRouter();

    const { data, isLoading, refetch } = useGetRevenueQuery({ page: 1, limit: 20 });
    const { refreshing, onRefresh } = useRefresh([refetch]);

    const currency = data?.currency ?? 'EUR';

    // Bars are drawn as a percentage of the tallest month, so a quiet year
    // still renders a readable chart.
    const { bars, maxValue } = useMemo(() => {
        const graph = data?.graph ?? [];
        const highest = graph.reduce((max, point) => Math.max(max, point.total), 0);
        return {
            bars: graph.map((point) => ({ month: point.label, value: point.total })),
            maxValue: highest || 1,
        };
    }, [data]);

    const transactions = useMemo(
        () =>
            (data?.transactions ?? []).map((tx) => ({
                id: tx._id,
                date: formatDate(tx.date ?? tx.releasedAt, {
                    day: 'numeric',
                    month: 'short',
                }),
                status: tx.scheduleStatus ?? tx.status,
                amount: formatMoney(tx.amount, tx.currency || currency),
            })),
        [data, currency],
    );

    const monthLabel = data?.thisMonth
        ? formatDate(new Date(data.thisMonth.year, data.thisMonth.month - 1, 1), {
              month: 'long',
              year: 'numeric',
          })
        : '';

    return (
        <SafeAreaView style={revStyles.safe}>
            <View style={{ paddingHorizontal: wp(20) }}>
                <SectionTitle title={t("Revenues")} />
            </View>
            <ScrollView
                contentContainerStyle={revStyles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >

                {/* Revenue this month card */}
                <View style={revStyles.card}>
                    <Body6 color={Colors.TEXT_COLOR}>{t("Revenue this month")}</Body6>
                    <H2 color={Colors.COLOR_ACTIVE} style={{ marginVertical: hp(4) }}>
                        {formatMoney(data?.thisMonth?.revenue ?? 0, currency)}
                    </H2>
                    <Caption3 color={Colors.TEXT_COLOR}>
                        Upcoming: {formatMoney(data?.upcoming ?? 0, currency)}
                    </Caption3>
                </View>

                {/* Chart card */}
                <View style={[revStyles.card, { marginTop: hp(16) }]}>
                    {/* Header */}
                    <View style={revStyles.chartHeader}>
                        <Pressable style={revStyles.monthPicker}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Body6 color={Colors.PRIMARY_TEXT}>{monthLabel}</Body6>
                                <Caption3 color={Colors.TEXT_COLOR}>
                                    <DownArrowIcon color={Colors.TEXT_COLOR} />
                                </Caption3>
                            </View>
                            <View>
                                <MonthIcon />
                            </View>
                        </Pressable>
                        <Pressable>
                            {/* <ExpandIcon size={20} color={Colors.COLOR_ACTIVE} /> */}
                        </Pressable>
                    </View>

                    {/* Bar chart */}
                    <View style={revStyles.chartArea}>
                        {/* Y labels */}
                        <View style={revStyles.yLabels}>
                            {[maxValue, Math.round(maxValue / 2), 0].map((v, i) => (
                                <Caption3 key={`${v}-${i}`} color={Colors.TEXT_COLOR}>
                                    {Math.round(v)}
                                </Caption3>
                            ))}
                        </View>
                        {/* Bars */}
                        <View style={revStyles.barsContainer}>
                            {bars.map((item, index) => (
                                <View key={`${item.month}-${index}`} style={revStyles.barCol}>
                                    <View style={revStyles.barTrack}>
                                        <View
                                            style={[
                                                revStyles.barFill,
                                                { height: `${(item.value / maxValue) * 100}%` },
                                            ]}
                                        />
                                    </View>
                                    <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(4) }}>
                                        {item.month}
                                    </Caption3>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* View revenue summary */}
                <Pressable style={revStyles.summaryBtn}>
                    <DocumentsIcon size={18} color={Colors.TEXT_COLOR} />
                    <Body6 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>{t("View revenue summary")}</Body6>
                    <RightAngleIcon size={24} color={Colors.TEXT_COLOR} />
                </Pressable>

                {/* Upcoming transactions */}
                <Body7 color={Colors.TEXT_COLOR} style={revStyles.txTitle}>
                    {t("Upcoming transactions")}
                </Body7>
                {isLoading && transactions.length === 0 && (
                    <SkeletonList count={3} variant="row" />
                )}
                {!isLoading && transactions.length === 0 && (
                    <Caption3 color={Colors.TEXT_COLOR}>{t("No transactions yet.")}</Caption3>
                )}
                {transactions.map((tx) => (
                    <React.Fragment key={tx.id}>
                        <Pressable
                            style={revStyles.txRow}
                            onPress={() =>
                                router.push({
                                    pathname: '/cleaner/profile/revenue',
                                    params: { transactionId: tx.id },
                                } as any)
                            }
                        >
                            <View style={revStyles.txIcon}>
                                <CalendarIcon size={20} color={Colors.TEXT_COLOR} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Body6 color={Colors.PRIMARY_TEXT}>{tx.date}</Body6>
                                <Caption3 color={Colors.TEXT_COLOR}>{tx.status}</Caption3>
                            </View>
                            <Body6 color={Colors.PRIMARY_TEXT}>{tx.amount}</Body6>
                            <RightAngleIcon size={24} color={Colors.PLACEHOLDER_TEXT} />
                        </Pressable>
                    </React.Fragment>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}

const revStyles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,

    },
    scroll: { paddingBottom: hp(40), paddingTop: hp(10) },
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(20),
        padding: wp(16),

    },
    // Chart
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', marginBottom: hp(16)
    },
    monthPicker: {
        flexDirection: 'row',
        // alignItems: 'center',
        width: "100%",
        padding: 10,
        borderRadius: 10,
        justifyContent: "space-between",
        backgroundColor: Colors.APP_BACKGROUND,
        marginBottom: hp(10)
    },
    chartArea: {
        flexDirection: 'row',
        height: hp(160)
    },
    yLabels: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingRight: wp(6),
        paddingBottom: hp(20)
    },
    barsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: wp(4)
    },
    barCol: {
        flex: 1,
        alignItems: 'center'
    },
    barTrack: {
        flex: 1, width: '100%',
        backgroundColor: Colors.BORDER_COLOR,
        borderRadius: wp(4),
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barFill: {
        width: '100%',
        backgroundColor: Colors.COLOR_ACTIVE,
        borderRadius: wp(4),
    },
    // Summary button
    summaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        marginTop: hp(16),
        padding: wp(16),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        marginHorizontal: wp(20)
    },
    // Transactions
    txTitle: {
        marginTop: hp(24),
        marginBottom: hp(12),
        marginHorizontal: wp(20)
    },
    txRow: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius:wp(14),
        marginBottom:hp(10),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        paddingVertical: hp(14),
        paddingHorizontal:wp(8),
        marginHorizontal: wp(20)
    },
    txIcon: {
        width: wp(40), height: wp(40),
        borderRadius: wp(20),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        alignItems: 'center', justifyContent: 'center',
    },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
});