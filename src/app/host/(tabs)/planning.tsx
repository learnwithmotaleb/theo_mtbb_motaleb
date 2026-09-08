import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { Body7, Caption3, H1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';
import { accommodationPhoto } from '@/lib/mappers';
import { useGetPlanningQuery } from '@/redux/services/accommodationApi';
import { AppImage } from '@/components/shared/AppImage';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

/** A row of the property picker that fronts the calendar. */
type PlanningProperty = {
    id: string;
    name: string;
    location: string;
    image: any;
};
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function PropertyCard({ item }: { item: PlanningProperty }) {
    const router = useRouter();

    return (
        <Pressable
            style={styles.card}
            onPress={() =>
                router.push({
                    pathname: '/host/planning/calendar',
                    params: { propertyId: item.id },
                } as any)
            }
        >
            <AppImage source={item.image} style={styles.thumb} contentFit="cover" />
            <View style={styles.info}>
                <Body7 color={Colors.TEXT_COLOR} numberOfLines={2}>
                    {item.name}
                </Body7>
                <View style={styles.row}>
                    <LocationIcon size={18} color={Colors.TEXT_COLOR} />
                    <Caption3 color={Colors.TEXT_COLOR}>{item.location}</Caption3>
                </View>
            </View>
            <RightAngleIcon size={28} color={Colors.TEXT_COLOR} />
        </Pressable>
    );
}

export default function PlanningScreen() {
    const t = useT();
    // "Planning" lists every accommodation together with its connected iCal
    // feeds, so the calendar can merge bookings with scheduled cleanings.
    const { data, isLoading, refetch } = useGetPlanningQuery({ page: 1, limit: 50 });
    const { refreshing, onRefresh } = useRefresh([refetch]);

    const properties = useMemo<PlanningProperty[]>(
        () =>
            (data?.data ?? []).map((accommodation) => ({
                id: accommodation._id,
                name: accommodation.name,
                location: accommodation.city || accommodation.address || '',
                image: accommodationPhoto(accommodation),
            })),
        [data],
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <H1 color={Colors.PRIMARY_TEXT}>{t("Planning")}</H1>
                <Caption3 color={Colors.TEXT_COLOR}>
                    {t("Select property to see it calendar")}
                </Caption3>
            </View>

            <FlatList
                data={properties}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PropertyCard item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    isLoading ? (
                        <SkeletonList count={3} />
                    ) : (
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {t("Add an accommodation to start planning.")}
                        </Caption3>
                    )
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    header: {
        paddingHorizontal: wp(20),
        paddingTop: hp(30),
        paddingBottom: hp(16),
        gap: hp(4),
    },
    list: {
        paddingHorizontal: wp(20),
        paddingBottom: hp(100),
        gap: hp(0),
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(14),
        paddingVertical: hp(12),
        backgroundColor:Colors.INPUT_BACKGROUND,
        marginBottom:hp(10),
        borderRadius:wp(8),
        padding:5
    },
    thumb: {
        width: wp(90),
        height: hp(110),
        borderRadius: wp(10),
    },
    info: { flex: 1, gap: hp(4) },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
});