import { useFormat } from '@/lib/useFormat';
import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { accommodationLocation, accommodationPhoto } from '@/lib/mappers';

import { useGetAccommodationForCleanerQuery } from '@/redux/services/accommodationApi';
import { AppImage } from '@/components/shared/AppImage';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <Caption2 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>{label}</Caption2>
            <Caption3 color={Colors.PRIMARY_TEXT}>{value}</Caption3>
        </View>
    );
}

export default function AccommodationDetailScreen() {
    const t = useT();
    const { formatMoney } = useFormat();
    const { accommodationId } = useLocalSearchParams<{ accommodationId: string }>();

    // Cleaner-scoped read: the backend only serves it when this cleaner has a
    // request or an assignment on the accommodation.
    const { data, isLoading } = useGetAccommodationForCleanerQuery(accommodationId, {
        skip: !accommodationId,
    });

    const property = useMemo(
        () => ({
            name: data?.name ?? 'Accommodation',
            location: accommodationLocation(data),
            image: accommodationPhoto(data),
            accommodationType: data?.accommodationType ?? '-',
            bedrooms: data?.numberOfRooms != null ? String(data.numberOfRooms) : '-',
            surface: data?.surface != null ? String(data.surface) + ' m2' : '-',
            floor: data?.floor || '-',
            elevator: data?.hasElevator ? 'Yes' : 'No',
            cleaningRate: formatMoney(data?.cleaningRate ?? 0),
        }),
        [data],
    );

    if (isLoading && !data) {
        return (
            <SafeAreaView style={[styles.safe, { paddingTop: hp(16) }]}>
                <SkeletonDetail />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t("Accommodation Details")} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero image */}
                <View style={styles.section}>
                    <AppImage
                        source={property.image}
                        style={styles.heroImage}
                        contentFit="cover"
                    />
                </View>

                {/* Name + address */}
                <View style={styles.section}>
                    <Caption2 color={Colors.PRIMARY_TEXT}>{property.name}</Caption2>
                    <View style={styles.row}>
                        <LocationIcon size={13} color={Colors.TEXT_COLOR} />
                        <Caption3 color={Colors.TEXT_COLOR}>{property.location}</Caption3>
                    </View>
                </View>

                {/* <View style={styles.divider} /> */}

                {/* Accommodation info */}
                <View style={styles.section}>
                    <InfoRow label={t("Accommodation Type")} value={property.accommodationType} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label={t("Bedrooms")} value={property.bedrooms} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label={t("Surface")} value={property.surface} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label={t("Floor")} value={property.floor} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label={t("Elevator")} value={property.elevator} />
                </View>

                {/* <View style={styles.divider} /> */}

                {/* Cleaning rate */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        {t("CLEANING RATE")}
                    </Caption2>
                    <View style={styles.rateRow}>
                        <Caption3 color={Colors.TEXT_COLOR}>{t("Cleaning Service")}</Caption3>
                        <Caption3 color={Colors.PRIMARY_TEXT}>{property.cleaningRate}</Caption3>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
    scroll: { paddingBottom: hp(40) },
    heroImage: {
        width: '100%',
        height: hp(200),
        borderRadius: wp(14),
        // marginVe: hp(16),
    },
    nameSection: { gap: hp(6), marginBottom: hp(16) },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    section: { 
        padding:12,
        // paddingHorizontal:wp(8),
        backgroundColor:Colors.INPUT_BACKGROUND,
        borderRadius:wp(8),
        marginTop:hp(15)
     },
    sectionLabel: { letterSpacing: 0.6, marginBottom: hp(10) },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(12),
    },
    rateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(8),
    },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
});