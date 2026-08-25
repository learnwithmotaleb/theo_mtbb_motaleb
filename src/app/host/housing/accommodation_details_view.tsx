import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Body6, Caption1, Caption2, Caption3, Caption4, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { ACCOMMODATION_DETAIL } from '@/data/hostFakeData';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <Caption3 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>{label}</Caption3>
            <Caption3 color={Colors.PRIMARY_TEXT}>{value}</Caption3>
        </View>
    );
}

export default function AccommodationDetailsViewScreen() {
    const router = useRouter();
    const { hasCleaner } = useLocalSearchParams<{ hasCleaner: string }>();

    const data = ACCOMMODATION_DETAIL;

    // HousingScreen থেকে '1' আসলে cleaner আছে, '0' আসলে নেই
    const showCleaner = hasCleaner === '1' && !!data.cleaner;

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Accommodation Details" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero image */}
                <Image
                    source={data.image}
                    style={styles.heroImage}
                    contentFit="cover"
                />

                {/* Name + address */}
                <View style={styles.card}>
                    <Body5 color={Colors.TEXT_COLOR}>{data.name}</Body5>
                    <View style={styles.addressRow}>
                        <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                        <Caption3 color={Colors.TEXT_COLOR}>{data.address}</Caption3>
                    </View>
                </View>

                {/* <View style={styles.divider} /> */}

                {/* Accommodation info */}
                <View style={styles.card}>
                    <InfoRow label="Accommodation Type" value={data.accommodationType} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Bedrooms" value={data.bedrooms} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Surface" value={data.surface} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Floor" value={data.floor} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Elevator" value={data.elevator} />
                </View>
                {/* <View style={styles.divider} /> */}

                {/* ── Cleaner section ──
                    showCleaner = true  → Image 1 (cleaner card দেখাবে)
                    showCleaner = false → Image 2 (cleaner section নেই)
                ── */}
                <View style={{marginVertical:hp(10)}}>
                    {showCleaner ? (
                        <>
                            <View style={styles.cleanerSection}>
                                <View style={styles.cleanerRow}>
                                    <Image
                                        source={data.cleaner!.image}
                                        style={styles.cleanerAvatar}
                                        contentFit="cover"
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Caption5
                                            color={Colors.TEXT_COLOR}
                                        >
                                            CLEANER
                                        </Caption5>
                                        <Caption1 color={Colors.PRIMARY_TEXT}>
                                            {data.cleaner!.name}
                                        </Caption1>
                                        <Caption5 color={Colors.TEXT_COLOR}>
                                            {data.cleaner!.cleaningsCompleted} Cleaning completed
                                        </Caption5>
                                    </View>
                                    <Pressable
                                        style={styles.manageBtn}
                                        onPress={() =>
                                            router.push('/host/housing/manage_cleaners' as any)
                                        }
                                    >
                                        <Caption3 color={Colors.TEXT_WHITE}>Manage</Caption3>
                                    </Pressable>
                                </View>
                            </View>
                            {/* <View style={styles.divider} /> */}
                        </>
                    ) : null}
                </View>

                {/* Cleaning rate */}
                <View style={styles.card}>
                    <Caption2
                        color={Colors.TEXT_COLOR}
                        style={[styles.sectionLabel, { marginTop: hp(8) }]}
                    >
                        CLEANING RATE
                    </Caption2>
                    <InfoRow label="Cleaning Service" value={data.cleaningRate} />

                </View>

                {/* Practical information */}
                <View style={styles.card}>
                    <Caption2
                    color={Colors.TEXT_COLOR}
                    style={[styles.sectionLabel, { marginTop: hp(16) }]}
                >
                    PRACTICAL INFORMATION
                </Caption2>

                {/* Key box row */}
                <View style={styles.keyRow}>
                    <View style={styles.keyBox}>
                        <Caption4 color={Colors.TEXT_COLOR}>Key Box</Caption4>
                        <Body6 color={Colors.PRIMARY_TEXT}>{data.practical.keyBox}</Body6>
                    </View>
                    <View style={styles.keyBox}>
                        <Caption4 color={Colors.TEXT_COLOR}>Key Box Code</Caption4>
                        <Body6 color={Colors.PRIMARY_TEXT}>{data.practical.keyBoxCode}</Body6>
                    </View>
                </View>

                {/* Specific instruction */}
                <View style={styles.instructionBox}>
                    <Caption4 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(6) }}>
                        Specific Instruction
                    </Caption4>
                    <Caption3 color={Colors.TEXT_COLOR}>
                        {data.practical.specificInstruction}
                    </Caption3>
                </View>
                </View>

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <CustomButton
                    title="Procced to Schedule"
                    onPress={() =>
                        router.push('/host/home/recommended_cleaning' as any)
                    }
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color={Colors.TEXT_WHITE}
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
                <Pressable
                    style={styles.editBtn}
                    onPress={() =>
                        router.push('/host/housing/edit_accommodation' as any)
                    }
                >
                    <Caption3 color={Colors.PRIMARY_TEXT}>Edit information</Caption3>
                </Pressable>
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
    scroll: {
        paddingBottom: hp(20),
    },
    heroImage: {
        width: '100%',
        height: hp(200),
        borderRadius: wp(14),
        marginVertical: hp(20),
    },
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(15),
        paddingVertical: hp(8),
        marginBottom: hp(10)

    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(4),
        marginTop: hp(4),
        marginBottom: hp(16),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(12),
    },

    sectionLabel: {
        letterSpacing: 0.6,
        marginBottom: hp(12),
    },
    cleanerSection: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(15),
        paddingVertical: hp(8)

    },
    cleanerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
    },
    cleanerAvatar: {
        width: wp(48),
        height: wp(48),
        borderRadius: wp(24),
    },
    manageBtn: {
        paddingHorizontal: wp(20),
        paddingVertical: hp(10),
        borderRadius: wp(10),
        backgroundColor: Colors.PRIMARY_TEXT,
    },
    keyRow: {
        flexDirection: 'row',
        gap: wp(12),
        marginBottom: hp(12),
    },
    keyBox: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        borderRadius: wp(10),
        padding: wp(12),
        gap: hp(4),
    },
    instructionBox: {
        backgroundColor:  Colors.APP_BACKGROUND,
        borderRadius: wp(10),
        padding: wp(12),
        marginBottom: hp(16),
    },
    footer: {
        // paddingVertical: hp(16),
        gap: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
    editBtn: {
        alignItems: 'center',
        paddingVertical: hp(14),
        borderRadius: wp(8),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
});