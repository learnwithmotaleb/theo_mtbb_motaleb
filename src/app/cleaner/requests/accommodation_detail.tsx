import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { CONNECTION_REQUESTS } from '@/data/cleanerFakeData';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
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
    const { hostId, propertyId } = useLocalSearchParams<{
        hostId: string;
        propertyId: string;
    }>();
    const host = CONNECTION_REQUESTS.find((h) => h.id === hostId) ?? CONNECTION_REQUESTS[0];
    const property = host.properties.find((p) => p.id === propertyId) ?? host.properties[0];

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Accommodation Details" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero image */}
                <View style={styles.section}>
                    <Image
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
                    <InfoRow label="Accommodation Type" value={property.accommodationType} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Bedrooms" value={property.bedrooms} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Surface" value={property.surface} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Floor" value={property.floor} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label="Elevator" value={property.elevator} />
                </View>

                {/* <View style={styles.divider} /> */}

                {/* Cleaning rate */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        CLEANING RATE
                    </Caption2>
                    <View style={styles.rateRow}>
                        <Caption3 color={Colors.TEXT_COLOR}>Cleaning Service</Caption3>
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