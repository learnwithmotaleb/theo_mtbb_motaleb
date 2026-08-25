import SectionTitle from '@/components/shared/SectionTitle';
import { Body2, Body4, Caption3, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
// import { Image } from 'expo-image';
// import { useRouter } from 'expo-router';
import { EditPenIcon } from '@/assets/icons/common_icon/EditPenIcon';
import { CameraIcon } from '@/assets/icons/host_icon/CameraIcon';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const PERSONAL_INFO = [
    { label: 'Full Name', value: 'Sophie Martin' },
    { label: 'About', value: 'Hello! I am Léa, a professional housekeeper with several years of experience. Serious, discreet, and organized, I attach great importance to the quality of work and your satisfaction. I can take care of the complete maintenance of your home: cleaning, ironing, tidying... Do not hesitate to contact me, I will be happy to help you!' },
    { label: 'SIRET Number', value: '4512 5612 45978' },
    { label: 'Email', value: 'ann.smith@example.com' },
    { label: 'Phone number', value: '+49 525 152 1326' },
    { label: 'Services', value: 'Tidying and organization\nIroning of laundry\nComplete home maintenance\nWindow cleaning' },
    { label: 'Spoken Language', value: 'English, French' },
];

const ADDRESS_INFO = [
    { label: 'Address', value: 'CA 12 Berlin' },
    { label: 'City', value: 'Berlin' },
    { label: 'Zip code', value: '10115' },
    { label: 'Country', value: 'Germany' },
];

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={infoStyles.row}>
            <View style={{ flex: 1 }}>
                <Caption5 color={Colors.TEXT_COLOR}>{label}:</Caption5>
                <Caption3 color={Colors.PRIMARY_TEXT}>{value}</Caption3>
            </View>
            <Pressable hitSlop={8}>
                <EditPenIcon size={18} color={Colors.COLOR_ACTIVE} />
            </Pressable>
        </View>
    );
}

export default function PersonalInformationScreen() {
    return (
        <SafeAreaView style={infoStyles.safe}>
            <SectionTitle title="Profile" />
            <ScrollView contentContainerStyle={infoStyles.scroll} showsVerticalScrollIndicator={false}>

                {/* Avatar + name + description */}
                <View style={infoStyles.profileHeader}>
                    <View style={infoStyles.avatarWrapper}>
                        <View style={[infoStyles.avatar, { backgroundColor: Colors.BORDER_COLOR }]} >
                            <Image
                                source={IMAGE_COMPONENTS.cleanerPP}
                                style={{ height: 80, width: 80 }}
                                contentFit="cover"
                            />
                        </View>

                        <View style={infoStyles.cameraBtn}>
                            {/* <EditPenIcon size={12} color="#fff" /> */}
                            <CameraIcon size={12} />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Body2 color={Colors.PRIMARY_TEXT}>Sophie Martin</Body2>
                        <Caption5 color={Colors.TEXT_COLOR}>
                            Your personal information is used to manage your account and improve your experience.
                        </Caption5>
                    </View>
                </View>

                {/* Personal Info section */}
                <Body4 color={Colors.COLOR_ACTIVE} style={infoStyles.sectionLabel}>
                    Personal Info:
                </Body4>
                <View style={infoStyles.card}>
                    {PERSONAL_INFO.map((item, idx) => (
                        <React.Fragment key={item.label}>
                            <InfoRow label={item.label} value={item.value} />
                            {/* {idx < PERSONAL_INFO.length - 1 && <View style={infoStyles.divider} />} */}
                        </React.Fragment>
                    ))}
                </View>

                {/* Address section */}
                <Body4 color={Colors.COLOR_ACTIVE} style={infoStyles.sectionLabel}>
                    Address:
                </Body4>
                <View style={infoStyles.card}>
                    {ADDRESS_INFO.map((item, idx) => (
                        <React.Fragment key={item.label}>
                            <InfoRow label={item.label} value={item.value} />
                            {/* {idx < ADDRESS_INFO.length - 1 && <View style={infoStyles.divider} />} */}
                        </React.Fragment>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const infoStyles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
    scroll: { paddingBottom: hp(40) },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(12),
        marginVertical: hp(16),
    },
    avatarWrapper: { position: 'relative' },
    avatar: { width: wp(72), height: wp(72), borderRadius: wp(36) },
    cameraBtn: {
        position: 'absolute',
        bottom: 0, right: 0,
        width: wp(22), height: wp(22),
        borderRadius: wp(11),
        backgroundColor: Colors.COLOR_ACTIVE,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: Colors.APP_BACKGROUND,
    },
    sectionLabel: { marginBottom: hp(8), marginTop: hp(4) },
    card: {
        // backgroundColor: Colors.INPUT_BACKGROUND,
        // borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
        marginBottom: hp(16),
    },
    row: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        gap: wp(8),
        marginBottom:hp(10)
    },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
});