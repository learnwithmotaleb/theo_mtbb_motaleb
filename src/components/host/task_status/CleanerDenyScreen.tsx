import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body4, Body7, Caption2, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { TASK_STATUS_DATA } from '@/data/hostFakeData';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

export function CleanerDenyScreen() {
    const router = useRouter();
    const data = TASK_STATUS_DATA.refused;

    return (
        <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
        >
            {/* Deny notice */}
            <View style={styles.denyBox}>
                <View style={styles.denyIcon}>
                    <Body7 color={Colors.COLOR_DANGER} style={{ fontSize: 28, fontWeight: "900" }}>✕</Body7>
                </View>
                <Body4 color={Colors.TEXT_COLOR} align="center">
                    <Body7>{data.cleanerName}</Body7> has declined this mission.
                </Body4>
                <Caption3 color={Colors.TEXT_COLOR} align="center">
                    No worries, choose another housekeeper for this cleaning.
                </Caption3>
            </View>

            {/* Apartment info */}
            <View style={styles.apartmentCard}>
                <Image
                    source={data.apartmentImage}
                    style={styles.thumb}
                    contentFit="cover"
                />
                <View style={styles.apartmentInfo}>
                    <Caption2 color={Colors.PRIMARY_TEXT} numberOfLines={2}>
                        {data.apartmentName}
                    </Caption2>
                    <View style={styles.infoRow}>
                        <View style={{ marginTop: hp(5) }}>
                            <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                        </View>
                        <View>
                            <Caption4 color={Colors.TEXT_COLOR}>Location:</Caption4>
                            <Caption4 color={Colors.PRIMARY_TEXT}>{data.location}</Caption4>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={{ marginTop: hp(5) }}>
                            <CalendarIcon size={18} color={Colors.TEXT_COLOR} />
                        </View>
                        <View>
                            <Caption4 color={Colors.TEXT_COLOR}>Ideal slot:</Caption4>
                            <Caption4 color={Colors.PRIMARY_TEXT}>{data.idealSlot}</Caption4>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={{marginTop:hp(5)}}>
                         <ClockIcon size={15} color={Colors.TEXT_COLOR} />
                       </View>
                       
                        <View>
                            <Caption4 color={Colors.TEXT_COLOR}>Time slot:</Caption4>
                            <Caption4 color={Colors.PRIMARY_TEXT}>{data.timeSlot}</Caption4>
                        </View>
                    </View>
                </View>
            </View>

            {/* No housekeeper available */}
            {data.noHousekeeperAvailable && (
                <View style={styles.noHkBox}>
                    <Body4 color={Colors.TEXT_COLOR}>No other housekeepers available</Body4>
                    <Caption3 color={Colors.TEXT_COLOR}>
                        Add a new housekeeper to your property.{'\n'}
                        We have professionals available near your accommodation.
                    </Caption3>
                </View>
            )}

            {/* Nearest Housekeepers */}
            <Body4 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
                Nearest Housekeeper
            </Body4>
            {data.nearestHousekeepers.map((hk) => (
                <View key={hk.id} style={styles.hkRow}>
                    <Image source={hk.image} style={styles.hkAvatar} contentFit="cover" />
                    <View style={{ flex: 1 }}>
                        <Body4 color={Colors.PRIMARY_TEXT}>{hk.name}</Body4>
                        <View style={styles.hkLocation}>
                            <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{hk.location}</Caption3>
                        </View>
                    </View>
                    <Pressable style={styles.sendBtn} onPress={() => { }}>
                        <Caption3 color={Colors.TEXT_COLOR}>Send</Caption3>
                    </Pressable>
                </View>
            ))}

            {/* Return button */}
            <CustomButton
                title="Return to homepage"
                onPress={() => router.replace('/host/(tabs)' as any)}
                width="100%"
                backgroundColor={Colors.PRIMARY_TEXT}
                color="#fff"
                borderRadius={wp(8)}
                style={{ marginTop: hp(24) }}
                height={hp(52)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingBottom: hp(40) },

    // Deny box
    denyBox: {
        // borderWidth: 1.5,
        // borderColor: Colors.COLOR_ACTIVE,
        // borderStyle: 'dashed',
        borderRadius: wp(12),
        padding: wp(16),
        alignItems: 'center',
        gap: hp(6),
        marginBottom: hp(16),
    },
    denyIcon: {
        width: wp(44), height: wp(44),
        borderRadius: wp(22),
        backgroundColor: "#FE585D1A",
        borderWidth: 2,
        borderColor: "#FE585D1A",
        alignItems: 'center', justifyContent: 'center',
    },

    // Apartment card
    apartmentCard: {
        flexDirection: 'row',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
        marginBottom: hp(16),
    },
    thumb: {
        width: wp(120),
        height: hp(160),
        borderRadius:wp(10)
    },
    apartmentInfo: {
        flex: 1,
        // padding: wp(12), 
        paddingHorizontal: wp(10),
        paddingVertical: wp(5),
        gap: hp(8)
    },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(6) },

    // No housekeeper
    noHkBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        padding: wp(14),
        gap: hp(4),
        marginBottom: hp(16),
    },

    // Housekeeper list
    sectionTitle: { marginBottom: hp(12) },
    hkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        paddingVertical: hp(10),
        // borderBottomWidth: 1,
        // borderBottomColor: Colors.BORDER_COLOR,
    },
    hkAvatar: { width: wp(44), height: wp(44), borderRadius: wp(22) },
    hkLocation: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    sendBtn: {
        paddingHorizontal: wp(20),
        paddingVertical: hp(8),
        borderRadius: wp(8),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        backgroundColor: "#F4F4F5",
    },
});