import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body6, Caption2, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { ALL_PLANNING_TASKS } from '@/data/planningfakedata';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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

export default function TaskDetailScreen() {
    const router = useRouter();
    const { taskId } = useLocalSearchParams<{ taskId: string }>();
    const task = ALL_PLANNING_TASKS.find((t) => t.id === taskId) ?? ALL_PLANNING_TASKS[0];

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Task Details" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero image */}
                <View style={styles.timeCard}>
                    <Image
                        source={task.image}
                        style={styles.heroImage}
                        contentFit="cover"
                    />

                    {/* Name + address */}
                    <View style={styles.nameSection}>
                        <Body6 color={Colors.PRIMARY_TEXT}>{task.apartmentName}</Body6>
                        <View style={styles.row}>
                            <LocationIcon size={13} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{task.address}</Caption3>
                        </View>
                    </View>
                </View>

                {/* Time card */}
                <View style={styles.timeCard}>
                    <View style={styles.timeRow}>
                        <ClockIcon size={16} color={Colors.TEXT_COLOR} />
                        <Caption3 color={Colors.TEXT_COLOR}>Time slot</Caption3>
                        <Caption3 color={Colors.PRIMARY_TEXT} style={{ marginLeft: 'auto' }}>
                            {task.time}
                        </Caption3>
                    </View>
                    {/* <View style={styles.divider} /> */}
                    <View style={styles.timeRow}>
                        <ClockIcon size={16} color={Colors.TEXT_COLOR} />
                        <Caption3 color={Colors.TEXT_COLOR}>Estimation</Caption3>
                        <Caption3 color={Colors.PRIMARY_TEXT} style={{ marginLeft: 'auto' }}>
                            {task.estimation}
                        </Caption3>
                    </View>
                </View>

                {/* Accommodation info */}

                <View style={styles.card}>
                    <Caption2
                        color={Colors.TEXT_COLOR}
                        style={styles.sectionLabel}
                    >
                        ACCOMMODATION DETAILS
                    </Caption2>
                    <InfoRow label="Accommodation Type" value="Apartment" />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Bedrooms" value="2 Bedrooms" />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Surface" value="65m²" />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Floor" value="3rd Floor" />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Elevator" value="Yes" />
                </View>

                {/* Cleaning rate */}
                <View style={styles.card}>
                    <Caption2
                        color={Colors.TEXT_COLOR}
                        style={styles.sectionLabel}
                    >
                        CLEANING RATE
                    </Caption2>
                    <InfoRow label="Cleaning Service" value="55,00 €" />
                </View>

                {/* Practical info */}
                <View style={styles.keyBoxContainer}>
                    <Caption2
                        color={Colors.TEXT_COLOR}
                        style={styles.sectionLabel}
                    >
                        PRACTICAL INFORMATION
                    </Caption2>
                    <View style={styles.keyRow}>
                        <View style={styles.keyBox}>
                            <Caption4 color={Colors.TEXT_COLOR}>Key Box</Caption4>
                            <Body6 color={Colors.PRIMARY_TEXT}>Yes</Body6>
                        </View>
                        <View style={styles.keyBox}>
                            <Caption4 color={Colors.TEXT_COLOR}>Key Box Code</Caption4>
                            <Body6 color={Colors.PRIMARY_TEXT}>2154</Body6>
                        </View>
                    </View>

                </View>
                <View style={styles.instructionBox}>
                    <Caption4 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(6) }}>
                        Specific Instruction
                    </Caption4>
                    <Caption3 color={Colors.TEXT_COLOR}>
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                    </Caption3>
                </View>
            </ScrollView>

            {/* Footer */}
            {/* <View style={styles.footer}>
                <CustomButton
                    title="Start Cleaning"
                    onPress={() =>
                        // router.push({
                        //     pathname: '/cleaner/task/checklist' as any,
                        //     params: { taskId: task.id },
                        // })
                        {}
                    }
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color={Colors.TEXT_WHITE}
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: { paddingBottom: hp(120) },

    heroImage: {
        width: '100%',
        height: hp(200),
        borderRadius: wp(14),
        marginVertical: hp(14),
    },
    nameSection: {
        gap: hp(5),
        marginBottom: hp(14),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(4),
    },

    // Time card
    timeCard: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        paddingHorizontal: wp(16),
        marginBottom: hp(20),
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        paddingVertical: hp(14),
    },

    // Section labels
    sectionLabel: {
        letterSpacing: 0.6,
        marginVertical: hp(10),
    },

    // Info card
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        paddingHorizontal: wp(16),
        marginBottom: hp(20),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(12),
    },
    divider: {
        height: 1,
        backgroundColor: Colors.BORDER_COLOR,
    },

    // Key box
    keyBoxContainer: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(12),
        gap: hp(4),
        marginBottom:hp(20)
    },
    keyRow: {
        flexDirection: 'row',
        gap: wp(12),
        marginBottom: hp(12),
    },
    keyBox: {
        flex: 1,
        backgroundColor: Colors.BORDER_COLOR,
        borderRadius: wp(10),
        padding: wp(12),
        gap: hp(4),
    },
    instructionBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        padding: wp(12),
        marginBottom: hp(16),
    },

    // Footer
    footer: {
        // paddingVertical: hp(16),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});