import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { Body2, Caption1, Caption3, Caption4, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { HOUSING_LIST } from '@/data/hostFakeData';
import { HousingItem } from '@/types/taskStatus';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function HousingCard({ item }: { item: HousingItem }) {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/host/housing/accommodation_details_view' as any,
            params: { hasCleaner: item.cleaners.length > 0 ? '1' : '0' },
        });
    };

    return (
        <Pressable style={styles.card} onPress={handlePress}>
            {/* Thumbnail */}
            <Image source={item.image} style={styles.thumb} contentFit="cover" />

            {/* Info */}
            <View style={styles.info}>
                {/* Title row */}
                <View style={styles.titleRow}>
                    <Caption1
                        color={Colors.PRIMARY_TEXT}
                        style={{ flex: 1 }}
                        numberOfLines={1}
                    >
                        {item.name}
                    </Caption1>
                    <RightAngleIcon size={22} color={Colors.TEXT_COLOR} />
                </View>

                {/* Location */}
                <View style={styles.locationRow}>
                    <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                    <Caption4 color={Colors.TEXT_COLOR}>{item.location}</Caption4>
                </View>

                {/* Cleaners or empty */}
                {item.cleaners.length > 0 ? (
                    <View style={styles.cleaners}>
                        {item.cleaners.map((c) => (
                            <View key={c.id} style={styles.cleanerRow}>
                                <Image
                                    source={c.image}
                                    style={styles.avatar}
                                    contentFit="cover"
                                />
                                <Caption3 color={Colors.PRIMARY_TEXT}>{c.name}</Caption3>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Caption4 color={Colors.TEXT_COLOR} style={{ marginTop: hp(6) }}>
                        No Cleaner Assigned
                    </Caption4>
                )}
            </View>
        </Pressable>
    );
}

export default function HousingScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <H2 color={Colors.PRIMARY_TEXT}>Housing</H2>
                <Pressable
                    style={styles.plusBtn}
                    onPress={() =>
                        router.push('/host/housing/general_information' as any)
                    }
                >
                    <Caption3 color={Colors.PRIMARY_TEXT} style={styles.plusText}>+</Caption3>
                    {/* <PlusCircleIcon size={24}/> */}
                </Pressable>
            </View>

            <View style={styles.content}>
                <FlatList
                    data={HOUSING_LIST}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={
                        <>
                            <Body2
                                color={Colors.PRIMARY_TEXT}
                                style={{ marginBottom: hp(4) }}
                            >
                                My Accommodations
                            </Body2>
                            <Caption3
                                color={Colors.TEXT_COLOR}
                                style={{ marginBottom: hp(20) }}
                            >
                                Manage your accommodations and the assigned cleaning staff.
                            </Caption3>
                        </>
                    }
                    renderItem={({ item }) => <HousingCard item={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(20),
        paddingVertical: hp(20),
    },
    plusBtn: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
    },
    plusText: { fontSize: 24, lineHeight: 28 },
    content: { flex: 1, paddingHorizontal: wp(20) },
    list: { paddingBottom: hp(120) },
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: hp(16),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        marginBottom: hp(8),
        gap: wp(14),
    },
    thumb: {
        width: wp(120),
        height: hp(160),
        borderRadius: wp(10),
        flexShrink: 0,
    },
    info: { flex: 1 },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(4),
        marginBottom: hp(4),
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(4),
        marginBottom: hp(8),
    },
    cleaners: { gap: hp(6) },
    cleanerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
    },
    avatar: {
        width: wp(28),
        height: wp(28),
        borderRadius: wp(14),
    },
});