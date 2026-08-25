import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { Body7, Caption3, H1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { PLANNING_PROPERTIES, PlanningProperty } from '@/data/planningfakedata';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
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
            <Image source={item.image} style={styles.thumb} contentFit="cover" />
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
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <H1 color={Colors.PRIMARY_TEXT}>Planning</H1>
                <Caption3 color={Colors.TEXT_COLOR}>
                    Select property to see it calendar
                </Caption3>
            </View>

            <FlatList
                data={PLANNING_PROPERTIES}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PropertyCard item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
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