import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { StarCircleIcon } from '@/assets/icons/cleaner_icon/StarCircleIcon';
import { TrashIcon } from '@/assets/icons/common_icon/TrashIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Caption3 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Client = {
    id: string;
    title: string;
    address: string;
    owner: string;
    isPrimary: boolean;
    image: any;
};

const CLIENTS: Client[] = [
    { id: '1', title: '2 Room apartment – City Center', address: '15 Pur da la Paris, 7500 Paris', owner: 'M. et Mme Matrin', isPrimary: true, image: IMAGE_COMPONENTS.apartment2 },
    { id: '2', title: '2 Room apartment – City Center', address: '15 Pur da la Paris, 7500 Paris', owner: 'M. et Mme Matrin', isPrimary: false, image: IMAGE_COMPONENTS.apartment1 },
    { id: '3', title: '2 Room apartment – City Center', address: '15 Pur da la Paris, 7500 Paris', owner: 'M. et Mme Matrin', isPrimary: false, image: IMAGE_COMPONENTS.apartment3 },
    { id: '4', title: '2 Room apartment – City Center', address: '15 Pur da la Paris, 7500 Paris', owner: 'M. et Mme Matrin', isPrimary: true, image: IMAGE_COMPONENTS.apartment7 },
];

function ClientCard({ item }: { item: Client }) {
    const handleDelete = () =>
        Alert.alert('Remove Client', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => { } },
        ]);

    return (
        <View style={clientStyles.card}>
            {/* Thumbnail */}
            <Image source={item.image} style={clientStyles.thumb} contentFit="cover" />

            {/* Info */}
            <View style={clientStyles.info}>
                <Body5 color={Colors.PRIMARY_TEXT}>{item.title}</Body5>

                <View style={clientStyles.metaRow}>
                    <LocationIcon size={12} color={Colors.TEXT_COLOR} />
                    <Caption3 color={Colors.TEXT_COLOR}>{item.address}</Caption3>
                </View>
                <View style={clientStyles.metaRow}>
                    <UserIcon size={12} color={Colors.COLOR_ACTIVE} />
                    <Caption3 color={Colors.TEXT_COLOR}>{item.owner}</Caption3>
                </View>

                {/* Badge + delete */}
                <View style={clientStyles.footer}>
                    <View style={[
                        clientStyles.badge,
                        item.isPrimary ? clientStyles.badgePrimary : clientStyles.badgeSecondary,
                    ]}>
                        {item.isPrimary && (
                            <StarCircleIcon />
                        )}
                        <Caption3 color={item.isPrimary ? Colors.COLOR_ACTIVE : Colors.TEXT_COLOR}>
                            {item.isPrimary ? 'Principal' : 'Secondary'}
                        </Caption3>
                    </View>

                    <Pressable style={clientStyles.deleteBtn} onPress={handleDelete}>
                        <TrashIcon size={16} color={Colors.COLOR_DANGER} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default function MyClientsScreen() {
    return (
        <SafeAreaView style={clientStyles.safe}>
            <SectionTitle title="My Clients" />
            <FlatList
                data={CLIENTS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ClientCard item={item} />}
                contentContainerStyle={clientStyles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const clientStyles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
    list: {
        paddingBottom: hp(40),
        paddingTop: hp(12),
        gap: hp(12)
    },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
         padding:5
    },
    thumb: {
        width: wp(110),
        height: '100%',
        borderRadius: wp(20),
       
    },
    info: { flex: 1, padding: wp(12), gap: hp(4) },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    footer: { flexDirection: 'row', alignItems: 'center', gap: wp(8), marginTop: hp(6) },
    badge: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(4),
        paddingVertical: hp(5),
        borderRadius: wp(8),
        borderWidth: 1,
    },
    badgePrimary: {
        borderColor: Colors.COLOR_ACTIVE,
        backgroundColor: '#35A9D61A',
    },
    badgeSecondary: {
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.APP_BACKGROUND,
    },
    badgeDot: {
        width: wp(8), height: wp(8),
        borderRadius: wp(4),
        backgroundColor: Colors.COLOR_ACTIVE,
    },
    deleteBtn: {
        width: wp(48), height: wp(32),
        borderRadius: wp(8),
        backgroundColor: '#FF3B301A',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FF3B3030',
    },
});