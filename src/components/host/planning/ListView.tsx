import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { AirBnbIcon } from '@/assets/icons/host_icon/AirBnbIcon';
import { BookingIcon } from '@/assets/icons/host_icon/BookingIcon';
import { LinkIcon } from '@/assets/icons/host_icon/LinkIcon';
import { PlusIcon } from '@/assets/icons/host_icon/PlusIcon';
import { RightArrowIcon } from '@/assets/icons/host_icon/RightArrowIcon';
import { CancelScheduleModal } from '@/components/host/planning/CancelScheduleModal';
import { CustomButton } from '@/components/shared/CustomButton';
import { Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { LIST_EVENTS, ListEvent, PLATFORM_COLORS } from '@/data/planningfakedata';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

// FIX 3: platform colored bg + white circle + icon
function PlatformIcon({ platform }: { platform: string }) {
    return (
        <View style={[
            styles.platformIconWrapper,
            { backgroundColor: PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS] + '20' }
        ]}>
            {/* white circle behind icon */}
            <View style={styles.iconCircle}>
                {platform === 'airbnb' ? (
                    <AirBnbIcon size={16} />
                ) : platform === 'booking' ? (
                    <BookingIcon size={16} />
                ) : (
                    <Caption3 color={Colors.TEXT_COLOR}>{platform[0].toUpperCase()}</Caption3>
                )}
            </View>
        </View>
    );
}

export function ListView({
    onConnectCalendar,
    hasData,
}: {
    onConnectCalendar: () => void;
    hasData: boolean;
}) {
    const router = useRouter();
    const [cancelVisible, setCancelVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ListEvent | null>(null);

    if (!hasData) {
        return (
            <View style={styles.emptyState}>
                <Caption3
                    color={Colors.PRIMARY_TEXT}
                    align="center"
                    style={{ fontFamily: 'Poppins_600SemiBold', marginBottom: hp(8) }}
                >
                    No Calendars Connected
                </Caption3>
                <Caption3
                    color={Colors.TEXT_COLOR}
                    align="center"
                    style={{ marginBottom: hp(20) }}
                >
                    Connect your booking calendar to automatically display your reservations
                </Caption3>
                {/* <Pressable style={styles.connectBtn} onPress={onConnectCalendar}>
                    <Caption3 color="#fff">⊕  Connect my calendar</Caption3>
                </Pressable> */}
                <CustomButton
                    title='Connect my calendar'
                    onPress={onConnectCalendar}
                    borderRadius={wp(8)}
                    height={hp(50)}
                    width={"70%"}
                    icon={<LinkIcon />}
                />
            </View>
        );
    }

    return (
        <>
            <FlatList
                data={LIST_EVENTS}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.row}
                        onPress={() => {
                            setSelectedEvent(item);
                            setCancelVisible(true);
                        }}
                    >
                        <PlatformIcon platform={item.platform} />

                        <View style={[
                            styles.leftBorder,
                            { backgroundColor: PLATFORM_COLORS[item.platform] },
                        ]} />

                        <View style={styles.rowContent}>
                            <View style={styles.dateRow}>
                                <Caption4 color={Colors.TEXT_COLOR}>{item.checkIn}</Caption4>
                                <RightArrowIcon />
                                <Caption4 color={Colors.TEXT_COLOR}>{item.checkOut}</Caption4>
                            </View>

                            <View style={styles.cleaningRow}>
                                {item.hasManualCleaning ? (
                                    <Pressable
                                        style={styles.plusCircle}
                                        onPress={() =>
                                            router.push('/host/housing/manage_cleaners' as any)
                                        }
                                    >
                                        <PlusIcon color={Colors.COLOR_ACTIVE} />
                                    </Pressable>
                                ) : (
                                    <Image
                                        source={item.cleanerImage}
                                        style={styles.cleanerAvatar}
                                        contentFit="cover"
                                    />
                                )}
                                <View style={{ flex: 1 }}>
                                    <Caption3 color={Colors.PRIMARY_TEXT}>{item.cleaningLabel}</Caption3>
                                    <Caption4 color={Colors.TEXT_COLOR}>{item.cleaningTime}</Caption4>
                                </View>
                                <RightAngleIcon size={22} color={Colors.TEXT_COLOR} />
                            </View>
                        </View>
                    </Pressable>
                )}
            />

            <CancelScheduleModal
                visible={cancelVisible}
                onClose={() => setCancelVisible(false)}
                onConfirm={() => setCancelVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    list: { paddingBottom: hp(20) },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        paddingVertical: hp(10),
        marginBottom: hp(10),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(8),
        paddingHorizontal: wp(7),
    },

    // FIX 3: outer colored bg
    platformIconWrapper: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    // FIX 3: inner white circle
    iconCircle: {
        height: wp(28),
        width: wp(28),
        borderRadius: wp(14),
        backgroundColor: Colors.TEXT_WHITE,
        alignItems: 'center',
        justifyContent: 'center',
    },

    leftBorder: {
        width: wp(3),
        height: '80%',
        borderRadius: wp(2),
        flexShrink: 0,
    },
    rowContent: { flex: 1, gap: hp(4) },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    cleaningRow: { flexDirection: 'row', alignItems: 'center', gap: wp(8) },
    cleanerAvatar: { width: wp(28), height: wp(28), borderRadius: wp(14) },
    plusCircle: {
        width: wp(28), height: wp(28), borderRadius: wp(14),
        borderWidth: 1.5, borderColor: Colors.COLOR_ACTIVE,
        alignItems: 'center', justifyContent: 'center',
    },
    emptyState: {
        alignItems: 'center',
        paddingHorizontal: wp(20),
        paddingTop: hp(40),
    },
    connectBtn: {
        backgroundColor: Colors.COLOR_ACTIVE,
        paddingHorizontal: wp(24),
        paddingVertical: hp(14),
        borderRadius: wp(12),
    },
});