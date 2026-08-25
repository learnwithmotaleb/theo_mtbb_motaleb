import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fp, hp, wp } from '../../../../utils/responsiveDevice';

import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body4, Body6, Caption1, Caption3, Caption5 } from '@/components/typo/Typography';

// Icons
import { DownArrowIcon } from '@/assets/icons/common_icon/DownArrowIcon';
import { MoneyBagIcon } from '@/assets/icons/common_icon/MoneyBagIcon';
import { SearchIcon } from '@/assets/icons/common_icon/SearchIcon';
import { CleaningBroomIcon } from '@/assets/icons/host_icon/CleaningBroomIcon';
import { FilterIcon } from '@/assets/icons/host_icon/FilterIcon';
import { InvoiceEuroIcon } from '@/assets/icons/host_icon/InvoiceEuroIcon';
import { InvoiceIcon } from '@/assets/icons/host_icon/InvoiceIcon';
import { PdfFileIcon } from '@/assets/icons/host_icon/PdfFileIcon';

// ── Fake data ─────────────────────────────────────────────────────────────────
const SUMMARY_STATS = [
    { icon: <CleaningBroomIcon size={28} color={Colors.STATUS_COLOR} />, label: 'Cleaning Performed', value: '24' },
    { icon: <MoneyBagIcon size={28} color={Colors.STATUS_COLOR} />,      label: 'Total Amount',       value: '€ 14,240.00' },
    { icon: <InvoiceIcon size={28} color={Colors.STATUS_COLOR} />,       label: 'Invoice Issued',     value: '24' },
    { icon: <InvoiceEuroIcon size={28} color={Colors.STATUS_COLOR} />,   label: 'Invoice Issued',     value: '€ 339' },
];

const FILTER_OPTIONS = ['This Month', 'Last Month', 'Last 3 Months', 'This Year'];

const SERVICE_HISTORY = Array.from({ length: 6 }, (_, i) => ({
    id: String(i + 1),
    date: '18 mai 2024',
    property: 'Apartment T3',
    cleaner: 'Shphie D.',
    amount: '55,00 €',
    status: 'Paid' as const,
}));

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <View style={styles.statCard}>
            <View style={styles.statIcon}>{icon}</View>
            <Caption3 color={Colors.TEXT_COLOR} style={styles.statLabel}>{label}</Caption3>
            <Body1 color={Colors.SECONDARY_TEXT}>{value}</Body1>
        </View>
    );
}

// ── Service row ───────────────────────────────────────────────────────────────
function ServiceRow({
    item,
    onPdf,
}: {
    item: typeof SERVICE_HISTORY[0];
    onPdf: () => void;
}) {
    return (
        <>
            <View style={styles.serviceRow}>
                <View style={styles.serviceInfo}>
                    <Caption3 color={Colors.PLACEHOLDER_TEXT}>{item.date}</Caption3>
                    <Caption1 color={Colors.PRIMARY_TEXT}>{item.property}</Caption1>
                    <Caption3 color={Colors.TEXT_COLOR}>{item.cleaner}</Caption3>
                </View>
                <View style={styles.serviceRight}>
                    <Caption3 color={Colors.PRIMARY_TEXT}>{item.amount}</Caption3>
                    <Caption1 color={Colors.COLOR_ACTIVE}>{item.status}</Caption1>
                </View>
                <Pressable style={styles.pdfBtn} onPress={onPdf}>
                    <PdfFileIcon size={22} color={Colors.STATUS_COLOR} />
                </Pressable>
            </View>
        </>
    );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function PastCleaningScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('This Month');
    const [filterOpen, setFilterOpen] = useState(false);
    const [navigating, setNavigating] = useState(false);

    const filtered = SERVICE_HISTORY.filter(
        (s) =>
            s.property.toLowerCase().includes(search.toLowerCase()) ||
            s.cleaner.toLowerCase().includes(search.toLowerCase())
    );

    const handlePdf = async () => {
        setNavigating(true);
        await new Promise((r) => setTimeout(r, 700));
        setNavigating(false);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="My Past Cleaning" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Summary header ── */}
                <View style={styles.summaryHeader}>
                    <Body4 color={Colors.SECONDARY_TEXT}>Summary</Body4>
                    <Pressable
                        style={styles.filterPill}
                        onPress={() => setFilterOpen(true)}
                    >
                        <Caption3 color={Colors.PRIMARY_TEXT}>{filter}</Caption3>
                        <DownArrowIcon color='#4B4B4B' />
                    </Pressable>
                </View>

                {/* ── 2×2 stat grid ── */}
                <View style={styles.statsGrid}>
                    {SUMMARY_STATS.map((s, i) => (
                        <StatCard key={i} icon={s.icon} label={s.label} value={s.value} />
                    ))}
                </View>

                {/* ── Service History ── */}
                <Body4 color={Colors.SECONDARY_TEXT} style={styles.historyTitle}>
                    Service History
                </Body4>

                {/* Search + Filter row */}
                <View style={styles.searchRow}>
                    <View style={styles.searchBox}>
                        <SearchIcon size={18} color={"#5D5F5F"} />
                        <TextInput
                            style={styles.searchInput}
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Search..."
                            placeholderTextColor={"#5D5F5F"}
                        />
                    </View>
                    <Pressable style={styles.filterBtn}>
                        <FilterIcon size={16} color={Colors.PRIMARY_TEXT} />
                        <Caption3 color={Colors.PRIMARY_TEXT}>Filter</Caption3>
                    </Pressable>
                </View>

                {/* List */}
                <View style={styles.listCard}>
                    {filtered.map((item) => (
                        <ServiceRow key={item.id} item={item} onPdf={handlePdf} />
                    ))}
                </View>

                {/* Export CTA */}
                <Pressable style={styles.exportCard}>
                    <View style={styles.exportIcon}>
                        <PdfFileIcon size={24} color={Colors.STATUS_COLOR} />
                    </View>
                    <View>
                        <Caption3 color={"#4B4B4B"}>
                            Need a personalized summary?
                        </Caption3>
                        <Caption5 color={"#4B4B4B"}>
                            Export your history for a specific payment
                        </Caption5>
                    </View>
                </Pressable>
            </ScrollView>

            {/* ── Filter modal ── */}
            <Modal visible={filterOpen} transparent animationType="fade">
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setFilterOpen(false)}
                >
                    <View style={styles.filterModal}>
                        {FILTER_OPTIONS.map((opt) => (
                            <Pressable
                                key={opt}
                                style={styles.filterOption}
                                onPress={() => {
                                    setFilter(opt);
                                    setFilterOpen(false);
                                }}
                            >
                                <Body6
                                    color={
                                        opt === filter ? Colors.STATUS_COLOR : Colors.PRIMARY_TEXT
                                    }
                                >
                                    {opt}
                                </Body6>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
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
        paddingTop: hp(20),
        paddingBottom: hp(32),
    },

    // ── Summary ───────────────────────────────────────────────────────────────
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(14),
    },
    filterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(6),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        borderRadius: wp(20),
        paddingHorizontal: wp(12),
        paddingVertical: hp(6),
        backgroundColor: Colors.INPUT_BACKGROUND,
    },

    // ── Stats grid ────────────────────────────────────────────────────────────
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: hp(24),
    },
    statCard: {
        width: '49%',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        padding: wp(16),
        marginBottom: hp(8),
        alignItems: 'center',
        gap: hp(4),
    },
    statIcon: {
        width: wp(44),
        height: wp(44),
        borderRadius: wp(10),
        backgroundColor: Colors.STATUS_COLOR_OPACITY,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(4),
    },
    statLabel: {
        marginVertical: hp(3),
        textAlign: 'center',
    },

    // ── History ───────────────────────────────────────────────────────────────
    historyTitle: {
        marginBottom: hp(12),
    },
    searchRow: {
        flexDirection: 'row',
        gap: wp(10),
        marginBottom: hp(14),
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(14),
        height: hp(46),
    },
    searchInput: {
        flex: 1,
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        fontSize: fp(14),
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(6),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(14),
        height: hp(46),
    },
    listCard: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        marginBottom: hp(16),
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        gap: wp(10),
    },
    serviceInfo: {
        flex: 1,
        gap: hp(3),
    },
    serviceRight: {
        alignItems: 'flex-end',
        gap: hp(3),
    },
    pdfBtn: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(10),
        backgroundColor: "#0088FF33",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "#0088FF33",
        marginLeft: wp(10),
    },

    // ── Export card ───────────────────────────────────────────────────────────
    exportCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        backgroundColor: Colors.STATUS_COLOR_OPACITY,
        borderRadius: wp(14),
        padding: wp(16),
    },
    exportIcon: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(10),
        backgroundColor: "#35A9D61A",
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    // ── Filter modal ──────────────────────────────────────────────────────────
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: hp(120),
        paddingRight: wp(20),
    },
    filterModal: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        overflow: 'hidden',
        minWidth: wp(160),
    },
    filterOption: {
        paddingVertical: hp(12),
        paddingHorizontal: wp(16),
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_COLOR,
    },
});