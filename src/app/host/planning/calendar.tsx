import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { PlusIcon } from '@/assets/icons/host_icon/PlusIcon';
import { CalendarView } from '@/components/host/planning/CalendarView';
import { ListView } from '@/components/host/planning/ListView';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body7, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { PLANNING_PROPERTIES } from '@/data/planningfakedata';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Tab = 'calendrier' | 'liste';

export default function CalendarScreen() {
    const router = useRouter();
    const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
    const property = PLANNING_PROPERTIES.find((p) => p.id === propertyId) ?? PLANNING_PROPERTIES[0];
    const [tab, setTab] = useState<Tab>('calendrier');

    const handleConnectCalendar = () => {
        router.push({
            pathname: '/host/planning/connect_calendar',
            params: { propertyId: property.id },
        } as any);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Calendar" />

            <View style={styles.content}>
                {/* Property card */}
                <View style={styles.propertyCard}>
                    <Image source={property.image} style={styles.thumb} contentFit="cover" />
                    <View style={styles.propertyInfo}>
                        <Body7 color={Colors.TEXT_COLOR} numberOfLines={2}>
                            {property.name}
                        </Body7>
                        <View style={styles.row}>
                            <LocationIcon size={18} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{property.location}</Caption3>
                        </View>
                    </View>
                </View>

                {/* Tab toggle */}
                <View style={styles.tabWrapper}>
                    {(['calendrier', 'liste'] as Tab[]).map((t) => (
                        <Pressable
                            key={t}
                            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
                            onPress={() => setTab(t)}
                        >
                            <Caption3
                                color={tab === t ? '#0088FF' : Colors.TEXT_COLOR}
                                style={tab === t ? { fontFamily: 'Poppins_600SemiBold' } : {}}
                            >
                                {t === 'calendrier' ? 'Calendrier' : 'Liste'}
                            </Caption3>
                        </Pressable>
                    ))}
                </View>

                {/* Tab content */}
                <View style={styles.tabContent}>
                    {tab === 'calendrier' ? (
                        <CalendarView
                            onConnectCalendar={handleConnectCalendar}
                            hasData={property.hasCalendarData}
                        />
                    ) : (
                        <ListView
                            onConnectCalendar={handleConnectCalendar}
                            hasData={property.hasCalendarData}
                        />
                    )}
                </View>
            </View>

            {/* Add a Manual Cleaning button — শুধু hasData true হলে দেখাবে */}
            {property.hasCalendarData && (
                <View style={styles.footer}>
                    <CustomButton
                        title=" Add a Manual Cleaning"
                        onPress={() => router.push('/host/housing/manage_cleaners' as any)}
                        width="100%"
                        backgroundColor="#0088FF"
                        color="#fff"
                        borderRadius={wp(8)}
                        height={hp(52)}
                        icon={<PlusIcon color='#fff' />}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    content: {
        flex: 1,
        marginTop: hp(20),
    },
    propertyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        marginBottom: hp(16),
    },
    thumb: { width: wp(130), height: hp(70), borderRadius: wp(10) },
    propertyInfo: { flex: 1, gap: hp(4) },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    tabWrapper: {
        flexDirection: 'row',
        borderRadius: wp(12),
        padding: wp(4),
        marginBottom: hp(16),
        gap: wp(8),
    },
    tabBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(10),
        borderRadius: wp(10),
        backgroundColor: Colors.INPUT_BACKGROUND,
    },
    tabBtnActive: {
        backgroundColor: '#EEF4FF',
    },
    tabContent: { flex: 1 },
    footer: {
        // paddingVertical: hp(16),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});