import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { AirBnbIcon } from '@/assets/icons/host_icon/AirBnbIcon';
import { BookingIcon } from '@/assets/icons/host_icon/BookingIcon';
import { LinkIcon } from '@/assets/icons/host_icon/LinkIcon';
import { SecurityIcon } from '@/assets/icons/host_icon/SecurityIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption2, Caption3, Caption4, H3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { PLANNING_PROPERTIES } from '@/data/planningfakedata';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Platform = {
    id: string;
    name: string;
    label: string;
    bgColor: string;
    textColor: string;
    icon: React.ReactNode;
};


const PLATFORMS: Platform[] = [
    { id: 'airbnb', name: 'Airbnb', label: 'A', bgColor: '#34C7591A', textColor: '#34C759', icon: <AirBnbIcon /> },
    { id: 'booking', name: 'Booking.com', label: 'B', bgColor: '#4B6DF61A', textColor: '#34C759', icon: <BookingIcon /> },
    // { id: 'vrbo', name: 'Vrbo', label: 'V', bgColor: '#1A1A2E20', textColor: '#34C759', icon: <AirBnbIcon /> },
    // { id: 'abritel', name: 'Abritel', label: '⌂', bgColor: '#0066CC20', textColor: '#34C759', icon: <AirBnbIcon /> },
    // { id: 'agoda', name: 'Agoda', label: '●', bgColor: '#FF690020', textColor: '#34C759', icon: <AirBnbIcon /> },
    { id: 'other', name: 'Other Platform', label: '⊕', bgColor: '#66666620', textColor: '#34C759', icon: <LinkIcon size={22} color='#1E1E1E' /> },
];

export default function ConnectCalendarScreen() {
    const router = useRouter();
    const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
    const property =
        PLANNING_PROPERTIES.find((p) => p.id === propertyId) ?? PLANNING_PROPERTIES[0];

    const [urls, setUrls] = useState<Record<string, string>>(
        Object.fromEntries(PLATFORMS.map((p) => [p.id, '']))
    );

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Connect Calendar" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Property card */}
                <View style={styles.propertyCard}>
                    <Image source={property.image} style={styles.thumb} contentFit="cover" />
                    <View style={styles.propertyInfo}>
                        <Caption2 color={Colors.PRIMARY_TEXT} numberOfLines={1}>
                            {property.name}
                        </Caption2>
                        <View style={styles.row}>
                            <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{property.location}</Caption3>
                        </View>
                    </View>
                </View>

                {/* Title */}
                <H3
                    color={Colors.TEXT_COLOR}
                    style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}
                >
                    Connect Your Calendar
                </H3>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Paste the iCal link from your platform to automatically import your bookingtts
                </Caption3>

                {/* Platform list */}
                {PLATFORMS.map((platform) => (
                    <View key={platform.id} style={styles.platformBlock}>
                        {/* Platform header */}
                        <View style={styles.platformHeader}>
                            <View style={[styles.platformIcon, { backgroundColor: platform.bgColor }]}>
                                <View style={styles.iconCircle}>
                                    {platform.icon}
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Caption3 color={Colors.PRIMARY_TEXT}>{platform.name}</Caption3>
                                <Caption4 color={Colors.TEXT_COLOR}>paste Ical(URL)</Caption4>
                            </View>
                            <Pressable
                                style={[styles.saveBtn, { backgroundColor: "#34C7591A" }]}
                                // onPress={() => {
                                //     if (urls[platform.id]) {
                                //         showToast(`${platform.name} calendar saved!`, 'success');
                                //     }
                                // }}
                                onPress={()=>router.push("/host/(tabs)/planning")}
                            >
                                <Caption3 color={platform.textColor}>Save</Caption3>
                            </Pressable>
                        </View>

                        {/* URL input */}
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.input}
                                placeholder="Example: www.website.com"
                                placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                                value={urls[platform.id]}
                                onChangeText={(v) =>
                                    setUrls((prev) => ({ ...prev, [platform.id]: v }))
                                }
                                autoCapitalize="none"
                                keyboardType="url"
                            />
                        </View>
                    </View>
                ))}

                {/* Security note */}
                <View style={styles.securityNote}>
                    <View style={styles.shieldIcon}>
                        <Caption3 color={Colors.COLOR_ACTIVE}><SecurityIcon/></Caption3>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Caption3 color={Colors.PRIMARY_TEXT}>Your data is secure</Caption3>
                        <Caption4 color={Colors.TEXT_COLOR}>
                            We only access your calendars, never bookings
                        </Caption4>
                    </View>
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
        paddingVertical: hp(20)
    },

    // Property
    propertyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        marginBottom: hp(16),
    },
    thumb: { width: wp(120), height: hp(70), borderRadius: wp(8) },
    propertyInfo: { flex: 1, gap: hp(4) },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },

    // Title
    title: { marginBottom: hp(6) },
    subtitle: { marginBottom: hp(24), lineHeight: hp(20) },

    // Platform block
    platformBlock: {
         marginBottom: hp(14),
        backgroundColor:Colors.INPUT_BACKGROUND,
        padding:8,
        borderRadius:wp(8)
        },
    platformHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        marginBottom: hp(8),
    },
    platformIcon: {
        width: wp(44), height: wp(44),
        borderRadius: wp(10),
        alignItems: 'center', justifyContent: 'center',
    },
    iconCircle: {
        height: wp(28),
        width: wp(28),
        borderRadius: wp(14),
        backgroundColor: Colors.TEXT_WHITE,
        alignItems: 'center',
        justifyContent: 'center',   
    },
    saveBtn: {
        paddingHorizontal: wp(16),
        paddingVertical: hp(8),
        borderRadius: wp(8),
    },
    inputBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(14),
        paddingVertical: hp(12),
        borderWidth:0.5,
        borderColor:Colors.BORDER_COLOR
    },
    input: {
        fontSize: 12,
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        padding: 0,
    },

    // Security
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        marginTop: hp(8),
    },
    shieldIcon: {
        width: wp(40), height: wp(40),
        borderRadius: wp(20),
        backgroundColor: Colors.INPUT_BACKGROUND,
        alignItems: 'center', justifyContent: 'center',
    },
});