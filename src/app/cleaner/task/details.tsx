import { AppertmentIcon } from '@/assets/icons/cleaner_icon/AppartmentIcon';
import { BathRoomIcon } from '@/assets/icons/cleaner_icon/BathRoomIcon';
import { BedRoomIcon } from '@/assets/icons/cleaner_icon/BedRoomIcon';
import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { FloorIcon } from '@/assets/icons/cleaner_icon/FloorIcon';
import { KeyIconIcon } from '@/assets/icons/cleaner_icon/KeyIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { ReportIcon } from '@/assets/icons/cleaner_icon/ReportIcon';
import { StarCircleIcon } from '@/assets/icons/cleaner_icon/StarCircleIcon';
import { SurfaceIcon } from '@/assets/icons/cleaner_icon/SurfaceIcon';
import { InfoIcon } from '@/assets/icons/common_icon/InfoIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { ThreeDotsIcon } from '@/assets/icons/host_icon/ThreeDots';
import { CancelTaskModal } from '@/components/cleaner/task/CancelTaskModal';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body6, Caption1, Caption2, Caption3, Caption4, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { CLEANER_TASKS, UPCOMING_TASKS } from '@/data/cleanerFakeData';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function PropertyRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <>
            <View style={styles.propRow}>
                <View style={styles.icongroup}>{icon}</View>
                <Caption2 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>{label}</Caption2>
                <Caption3 color={Colors.PRIMARY_TEXT}>{value}</Caption3>
            </View>
            {/* <View style={styles.divider} /> */}
        </>
    );
}

export default function TaskDetailsScreen() {
    const router = useRouter();
    const { taskId, isUpcoming } = useLocalSearchParams<{
        taskId: string;
        isUpcoming: string;
    }>();
    const upcoming = isUpcoming === '1';
    const allTasks = [...CLEANER_TASKS, ...UPCOMING_TASKS];
    const task = allTasks.find((t) => t.id === taskId) ?? allTasks[0];

    const [cancelVisible, setCancelVisible] = useState(false);

    return (
        <SafeAreaView style={styles.safe}>
            {/* Custom header with 3 dots */}
            <View style={styles.header}>
                <SectionTitle
                    title="Details"
                    containerStyle={{ flex: 1 }}
                />
                <Pressable
                    style={styles.dotsBtn}
                    onPress={() => setCancelVisible(true)}
                >
                    <ThreeDotsIcon color='#000000' />
                </Pressable>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Apartment card */}
                <View style={styles.apartmentCard}>
                    <Image
                        source={task.image}
                        style={styles.thumb}
                        contentFit="cover"
                    />
                    <View style={styles.apartmentInfo}>
                        <Caption1 color={Colors.PRIMARY_TEXT} numberOfLines={2}>
                            {task.apartmentName}
                        </Caption1>
                        <View style={styles.row}>
                            <LocationIcon size={15} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{task.address}</Caption3>
                        </View>
                        <View style={styles.principalBadge}>
                            <Caption4 color={Colors.TEXT_COLOR}>
                                {task.isPrincipal ? <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: wp(4) }}>
                                    <StarCircleIcon size={15} color='#8E8E93' /><Caption5>Principal</Caption5></View> : 'Substitute'}
                            </Caption4>
                        </View>
                    </View>
                </View>

                {/* Upcoming Cleaning */}
                <View style={styles.section}>

                    <View style={styles.mainDateContainer}>
                        <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                            UPCOMING CLEANING
                        </Caption2>
                        <View style={styles.dateTimeRow}>
                            <View style={styles.dateBox}>
                                <View style={styles.icongroup}>
                                    <CalendarIcon size={18} color={Colors.TEXT_COLOR} />
                                </View>
                                <View style={""}>
                                    <Caption4 color={Colors.TEXT_COLOR}>Date</Caption4>
                                    <Caption1 color={Colors.PRIMARY_TEXT}>{task.date}</Caption1>
                                </View>

                            </View>
                            <View style={styles.dateTimeDivider} />
                            <View style={styles.dateBox}>
                                <View style={styles.icongroup}>
                                    <ClockIcon size={20} color={Colors.TEXT_COLOR} />
                                </View>
                                <View style={""}>
                                    <Caption4 color={Colors.TEXT_COLOR}>Time</Caption4>
                                    <Caption1 color={Colors.PRIMARY_TEXT}>{task.time}</Caption1>
                                </View>

                            </View>
                        </View>
                        <View style={styles.infoNote}>
                            <InfoIcon color='#8E8E93' size={18} />
                            <Caption4 color={Colors.TEXT_COLOR}> Please arrive within indicated time slot</Caption4>
                        </View>

                    </View>

                </View>

                {/* Property information */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        PROPERTY INFORMATION
                    </Caption2>
                    <PropertyRow icon={<Caption3><AppertmentIcon /></Caption3>} label="Type" value={task.type} />
                    <PropertyRow icon={<Caption3><SurfaceIcon /></Caption3>} label="Surface" value={task.surface} />
                    <PropertyRow icon={<Caption3><FloorIcon /></Caption3>} label="Floor" value={task.floor} />
                    <PropertyRow icon={<Caption3><BedRoomIcon /></Caption3>} label="Rooms" value={task.rooms} />
                    <PropertyRow icon={<Caption3><BathRoomIcon /></Caption3>} label="Bathrooms" value={task.bathrooms} />
                    <PropertyRow icon={<Caption3><KeyIconIcon /></Caption3>} label="Access" value={task.access} />
                </View>

                {/* Cleaning rate */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        CLEANING RATE
                    </Caption2>
                    <View style={styles.rateRow}>
                        <Caption3 color={Colors.TEXT_COLOR}>Cleaning Service</Caption3>
                        <Caption3 color={Colors.PRIMARY_TEXT}>{task.cleaningRate}</Caption3>
                    </View>
                </View>

                {/* Practical information */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        PRACTICAL INFORMATION
                    </Caption2>
                    <View style={styles.keyRow}>
                        <View style={styles.keyBox}>
                            <Caption4 color={Colors.TEXT_COLOR}>Key Box</Caption4>
                            <Body6 color={Colors.PRIMARY_TEXT}>{task.keyBox}</Body6>
                        </View>
                        <View style={styles.dateTimeDivider} />
                        <View style={styles.keyBox}>
                            <Caption4 color={Colors.TEXT_COLOR}>Key Box Code</Caption4>
                            <Body6 color={Colors.PRIMARY_TEXT}>{task.keyBoxCode}</Body6>
                        </View>
                    </View>
                    <View style={styles.instructionBox}>
                        <Caption4 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(6) }}>
                            Specific Instruction
                        </Caption4>
                        <Caption3 color={Colors.TEXT_COLOR}>{task.specificInstruction}</Caption3>
                    </View>
                </View>

                {/* Contact with client */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        CONTACT WITH CLIENT
                    </Caption2>
                    <View style={styles.clientRow}>
                        <Image
                            source={task.client.image}
                            style={styles.clientAvatar}
                            contentFit="cover"
                        />
                        <View style={{ flex: 1 }}>
                            <Body1 color={"#4B4B4B"}>{task.client.name}</Body1>
                            <Caption3 color={Colors.TEXT_COLOR}>{task.client.phone}</Caption3>
                        </View>
                        <Pressable style={styles.messageBtn} onPress={() => router.push("/cleaner/(tabs)/message")}>
                            <Caption3 color={Colors.TEXT_COLOR}>Message</Caption3>
                        </Pressable>
                    </View>
                </View>


            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <CustomButton
                    title='REPORT A DISPUTE'
                    icon={<ReportIcon />}
                    onPress={() => { }}
                    color='#4B4B4B'
                    backgroundColor='#74748014'
                    borderRadius={wp(8)}
                    height={hp(52)}
                    width="100%"
                />
                <CustomButton
                    title="Complete Task"
                    onPress={() =>
                        router.push({
                            pathname: '/cleaner/task/checklist',
                            params: { taskId: task.id },
                        } as any)
                    }
                    width="100%"
                    backgroundColor={upcoming ? "#8E8E93" : Colors.PRIMARY_TEXT}
                    color={upcoming ? "#FFFFFF" : '#fff'}
                    borderRadius={wp(8)}
                    height={hp(52)}
                    disabled={upcoming}
                />
            </View>

            {/* Cancel modal */}
            <CancelTaskModal
                visible={cancelVisible}
                onClose={() => setCancelVisible(false)}
                onConfirm={() => {
                    setCancelVisible(false);
                    router.back();
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: wp(20),
    },
    dotsBtn: {
        // padding: wp(15)
        // marginRight:wp(50)
    },
    dots: { fontSize: 22 },
    scroll: { paddingHorizontal: wp(20), paddingBottom: hp(20) },

    // Apartment card
    apartmentCard: {
        flexDirection: 'row',
        gap: wp(12),
        marginVertical: hp(16),
        backgroundColor: Colors.INPUT_BACKGROUND,
        padding: 10,
        borderRadius: wp(8),
    },
    thumb: {
        width: wp(100),
        height: hp(100),
        borderRadius: wp(10)
    },
    apartmentInfo: { flex: 1, gap: hp(4) },
    principalBadge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.APP_BACKGROUND,
        borderRadius: wp(20),
        paddingHorizontal: wp(10),
        paddingVertical: hp(3),
    },

    // Sections
    section: {
        marginBottom: hp(16),
        backgroundColor: Colors.INPUT_BACKGROUND,
        padding: 12,
        borderRadius: wp(8)
    },
    sectionLabel: { letterSpacing: 0.6, marginBottom: hp(12) },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },

    // Date/Time
    mainDateContainer: {
        // backgroundColor: Colors.INPUT_BACKGROUND,
        // borderRadius: wp(12),
        // padding: wp(12),
        // marginBottom: hp(12),
    },
    dateTimeRow: {
        flexDirection: 'row',
        marginTop: hp(10)
    },
    dateBox: {
        flexDirection: "row",
        gap: hp(2)
    },
    icongroup: {
        height: hp(32),
        width: wp(32),
        borderRadius: wp(16),
        padding: 5,
        backgroundColor: "#8F8F8F1A",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp(5)
    },
    dateTimeDivider: {
        width: 1,
        backgroundColor: Colors.BORDER_COLOR,
        marginHorizontal: wp(12),
    },
    infoNote: {
        flexDirection: "row",
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(8),
        padding: wp(10),
        gap: wp(5),
        marginTop: hp(10)
    },

    // Property rows
    propRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(12),
        gap: wp(10),

    },
    propIcon: { width: wp(24), alignItems: 'center' },
    rateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(8),
    },

    // Key boxes
    keyRow: {
        flexDirection: 'row',
        gap: wp(12),
        marginBottom: hp(10),
        backgroundColor: "#F9F9F9",
        paddingVertical: hp(5),
        borderRadius: wp(10)
    },
    keyBox: {
        flex: 1,
        // backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        padding: wp(12),
        gap: hp(4),
    },
    instructionBox: {
        // backgroundColor: Colors.INPUT_BACKGROUND,
        backgroundColor: "#F9F9F9",
        paddingVertical: hp(5),
        borderRadius: wp(10),
        padding: wp(12),
        marginTop: hp(10)
    },

    // Client
    clientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
    },
    clientAvatar: { width: wp(48), height: wp(48), borderRadius: wp(24) },
    messageBtn: {
        paddingHorizontal: wp(14),
        paddingVertical: hp(8),
        borderRadius: wp(8),
        backgroundColor: "#74748014",
    },

    // Report
    reportBtn: {
        alignItems: 'center',
        paddingVertical: hp(14),
        marginBottom: hp(8),
    },

    // Footer
    footer: {
        paddingHorizontal: wp(20),
        // paddingVertical: hp(16),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
});