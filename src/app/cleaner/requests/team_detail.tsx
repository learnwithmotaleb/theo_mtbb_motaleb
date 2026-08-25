import { AppertmentIcon } from '@/assets/icons/cleaner_icon/AppartmentIcon';
import { BathRoomIcon } from '@/assets/icons/cleaner_icon/BathRoomIcon';
import { BedRoomIcon } from '@/assets/icons/cleaner_icon/BedRoomIcon';
import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { FloorIcon } from '@/assets/icons/cleaner_icon/FloorIcon';
import { KeyIconIcon } from '@/assets/icons/cleaner_icon/KeyIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { SurfaceIcon } from '@/assets/icons/cleaner_icon/SurfaceIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body6, Caption2, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { CLEANING_REQUESTS } from '@/data/cleanerFakeData';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function PropertyRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <View style={styles.propRow}>
            <View style={styles.iconGroup}>{icon}</View>
            <Caption2 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>{label}</Caption2>
            <Caption3 color={Colors.PRIMARY_TEXT}>{value}</Caption3>
        </View>
    );
}

export default function TeamDetailScreen() {
    const router = useRouter();
    const { requestId } = useLocalSearchParams<{ requestId: string }>();
    const request = CLEANING_REQUESTS.find((r) => r.id === requestId) ?? CLEANING_REQUESTS[0];

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={`Team – Appartement T3`} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Apartment card */}
                <View style={styles.apartmentCard}>
                    <Image source={request.image} style={styles.thumb} contentFit="cover" />
                    <View style={styles.apartmentInfo}>
                        <Caption2 color={Colors.PRIMARY_TEXT} numberOfLines={1}>
                            {request.apartmentName}
                        </Caption2>
                        {/* Active badge */}
                        <View style={styles.activeBadge}>
                            <Caption4 color={Colors.COLOR_ACTIVE}>Active</Caption4>
                        </View>
                        <View style={styles.row}>
                            <LocationIcon size={15} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{request.location}</Caption3>
                        </View>
                        <View style={styles.row}>
                            <CalendarIcon size={15} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>
                                {request.cleaningsCompleted} cleanings completed
                            </Caption3>
                        </View>
                        {/* <Pressable style={styles.arrowBtn} onPress={() => {}}>
                            <RightAngleIcon size={16} color={Colors.TEXT_COLOR} />
                        </Pressable> */}
                    </View>
                </View>

                {/* Property information */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        PROPERTY INFORMATION
                    </Caption2>
                    <PropertyRow icon={<AppertmentIcon />} label="Type" value={request.type} />
                    {/* <View style={styles.divider} /> */}
                    <PropertyRow icon={<SurfaceIcon />} label="Surface" value={request.surface} />
                    {/* <View style={styles.divider} /> */}
                    <PropertyRow icon={<FloorIcon />} label="Floor" value={request.floor} />
                    {/* <View style={styles.divider} /> */}
                    <PropertyRow icon={<BedRoomIcon />} label="Rooms" value={request.rooms} />
                    {/* <View style={styles.divider} /> */}
                    <PropertyRow icon={<BathRoomIcon />} label="Bathrooms" value={request.bathrooms} />
                    {/* <View style={styles.divider} /> */}
                    <PropertyRow icon={<KeyIconIcon />} label="Access" value={request.access} />
                </View>

                {/* Cleaning rate */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        CLEANING RATE
                    </Caption2>
                    <View style={styles.rateRow}>
                        <Caption3 color={Colors.TEXT_COLOR}>Cleaning Service</Caption3>
                        <Caption3 color={Colors.PRIMARY_TEXT}>{request.cleaningRate}</Caption3>
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
                            <Body6 color={Colors.PRIMARY_TEXT}>{request.keyBox}</Body6>
                        </View>
                        <View style={styles.keyDivider} />
                        <View style={styles.keyBox}>
                            <Caption4 color={Colors.TEXT_COLOR}>Key Box Code</Caption4>
                            <Body6 color={Colors.PRIMARY_TEXT}>{request.keyBoxCode}</Body6>
                        </View>
                    </View>
                    <View style={styles.instructionBox}>
                        <Caption4 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(6) }}>
                            Specific Instruction
                        </Caption4>
                        <Caption3 color={Colors.TEXT_COLOR}>{request.specificInstruction}</Caption3>
                    </View>
                </View>

                {/* Contact with client */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        CONTACT WITH CLIENT
                    </Caption2>
                    <View style={styles.clientRow}>
                        <Image
                            source={request.client.image}
                            style={styles.clientAvatar}
                            contentFit="cover"
                        />
                        <View style={{ flex: 1 }}>
                            <Body1 color="#4B4B4B">{request.client.name}</Body1>
                            <Caption3 color={Colors.TEXT_COLOR}>{request.client.phone}</Caption3>
                        </View>
                        <Pressable style={styles.messageBtn} onPress={() => router.push("/cleaner/(tabs)/message")}>
                            <Caption3 color={Colors.TEXT_COLOR}>Message</Caption3>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                {/* <Pressable style={styles.refuseBtn} onPress={() => router.back()}>
                    <Caption3 color={Colors.COLOR_DANGER}>Refuse</Caption3>
                </Pressable>
                <Pressable
                    style={styles.acceptBtn}
                    onPress={() => {
                        router.back();
                    }}
                >
                    <Caption3 color="#fff">Accept</Caption3>
                </Pressable> */}

                <CustomButton
                    title='Refuse'
                    color='#FF383C'
                    onPress={() => router.back()}
                    borderRadius={wp(5)}
                    borderColor='#FF383C1A'
                    backgroundColor={Colors.APP_BACKGROUND}
                    width="49%"
                />
                <CustomButton
                    title='Accept'
                    color='#FFFFFF'
                    onPress={() => {
                        router.back();
                    }}
                    borderRadius={wp(5)}
                    borderColor='#FF383C1A'
                    backgroundColor={"#000000"}
                    width="49%"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1, backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: { paddingBottom: hp(20) },

    // Apartment card
    apartmentCard: {
        flexDirection: 'row',
        gap: wp(12),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(12),
        marginBottom: hp(16),
        marginTop: hp(8),
    },
    thumb: { width: wp(100), height: hp(110), borderRadius: wp(8) },
    apartmentInfo: { flex: 1, gap: hp(4) },
    activeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#E8F8F0',
        borderRadius: wp(20),
        paddingHorizontal: wp(10),
        paddingVertical: hp(3),
        // borderWidth: 1,
        // borderColor: Colors.COLOR_ACTIVE,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    arrowBtn: { alignSelf: 'flex-end', marginTop: 'auto' },

    // Sections
    section: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(14),
        marginBottom: hp(12),
    },
    sectionLabel: { letterSpacing: 0.6, marginBottom: hp(10) },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR, marginVertical: hp(2) },

    // Property rows
    propRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(10),
        gap: wp(10),
    },
    iconGroup: {
        width: wp(32),
        height: wp(32),
        borderRadius: wp(16),
        backgroundColor: '#8F8F8F1A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(8),
    },

    // Key boxes
    keyRow: {
        flexDirection: 'row',
        backgroundColor: '#F9F9F9',
        borderRadius: wp(10),
        marginBottom: hp(10),
    },
    keyDivider: { width: 1, backgroundColor: Colors.BORDER_COLOR },
    keyBox: { flex: 1, padding: wp(12), gap: hp(4) },
    instructionBox: {
        backgroundColor: '#F9F9F9',
        borderRadius: wp(10),
        padding: wp(12),
    },

    // Client
    clientRow: { flexDirection: 'row', alignItems: 'center', gap: wp(10) },
    clientAvatar: { width: wp(48), height: wp(48), borderRadius: wp(24) },
    messageBtn: {
        paddingHorizontal: wp(14),
        paddingVertical: hp(8),
        borderRadius: wp(8),
        backgroundColor: '#74748014',
    },

    // Footer
    footer: {
        flexDirection: 'row',
        // paddingHorizontal: wp(20),
        // paddingVertical: hp(16),
        gap: wp(10),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
    refuseBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(14),
        borderRadius: wp(12),
        borderWidth: 1,
        borderColor: Colors.COLOR_DANGER,
    },
    acceptBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(14),
        borderRadius: wp(12),
        backgroundColor: Colors.PRIMARY_TEXT,
    },
});