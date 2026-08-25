import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { DocumentsIcon } from '@/assets/icons/cleaner_icon/DocumentsIcon';
import { MonthIcon } from '@/assets/icons/cleaner_icon/MonthIcon';
import { DownArrowIcon } from '@/assets/icons/common_icon/DownArrowIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body6, Body7, Caption3, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const BAR_DATA = [
    { month: 'Dec', value: 70 },
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 82 },
    { month: 'Mar', value: 30 },
    { month: 'AVR.', value: 62 },
    { month: 'May', value: 85 },
    { month: 'June', value: 28 },
    { month: 'July', value: 70 },
];
const MAX_VALUE = 100;

const TRANSACTIONS = [
    { id: '1', date: '10 May', status: 'Scheduled', amount: '62,44 €' },
    { id: '2', date: '10 May', status: 'Scheduled', amount: '62,44 €' },
    { id: '3', date: '10 May', status: 'Scheduled', amount: '62,44 €' },
];

export default function RevenueScreen() {
    return (
        <SafeAreaView style={revStyles.safe}>
            <View style={{ paddingHorizontal: wp(20) }}>
                <SectionTitle title="Revenues" />
            </View>
            <ScrollView contentContainerStyle={revStyles.scroll} showsVerticalScrollIndicator={false}>

                {/* Revenue this month card */}
                <View style={revStyles.card}>
                    <Body6 color={Colors.TEXT_COLOR}>Revenue this month</Body6>
                    <H2 color={Colors.COLOR_ACTIVE} style={{ marginVertical: hp(4) }}>622.78 €</H2>
                    <Caption3 color={Colors.TEXT_COLOR}>Upcoming: 62,44 €</Caption3>
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
                                <Body6 color={Colors.PRIMARY_TEXT}>April 2024</Body6>
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
                            {[100, 50, 0].map((v) => (
                                <Caption3 key={v} color={Colors.TEXT_COLOR}>{v}</Caption3>
                            ))}
                        </View>
                        {/* Bars */}
                        <View style={revStyles.barsContainer}>
                            {BAR_DATA.map((item) => (
                                <View key={item.month} style={revStyles.barCol}>
                                    <View style={revStyles.barTrack}>
                                        <View
                                            style={[
                                                revStyles.barFill,
                                                { height: `${(item.value / MAX_VALUE) * 100}%` },
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
                    <Body6 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>View revenue summary</Body6>
                    <RightAngleIcon size={24} color={Colors.TEXT_COLOR} />
                </Pressable>

                {/* Upcoming transactions */}
                <Body7 color={Colors.TEXT_COLOR} style={revStyles.txTitle}>
                    Upcoming transactions
                </Body7>
                {TRANSACTIONS.map((tx, idx) => (
                    <React.Fragment key={tx.id}>
                        <View style={revStyles.txRow}>
                            <View style={revStyles.txIcon}>
                                <CalendarIcon size={20} color={Colors.TEXT_COLOR} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Body6 color={Colors.PRIMARY_TEXT}>{tx.date}</Body6>
                                <Caption3 color={Colors.TEXT_COLOR}>{tx.status}</Caption3>
                            </View>
                            <Body6 color={Colors.PRIMARY_TEXT}>{tx.amount}</Body6>
                            <RightAngleIcon size={24} color={Colors.PLACEHOLDER_TEXT} />
                        </View>
                        {/* {idx < TRANSACTIONS.length - 1 && <View style={revStyles.divider} />} */}
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