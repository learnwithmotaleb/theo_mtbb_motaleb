import { EditPenIcon } from '@/assets/icons/common_icon/EditPenIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Caption3, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const PUBLIC_INFO = [
    {
        label: 'About',
        value: 'Hello! I am Léa, a professional housekeeper with several years of experience. Serious, discreet, and organized, I attach great importance to the quality of work and your satisfaction. I can take care of the complete maintenance of your home: cleaning, ironing, tidying... Do not hesitate to contact me, I will be happy to help you!',
    },
    {
        label: 'Services',
        value: 'Tidying and organization\nIroning of laundry\nComplete home maintenance\nWindow cleaning',
    },
    {
        label: 'Spoken Language',
        value: 'English, French',
    },
];

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={aboutStyles.row}>
            <View style={{ flex: 1 }}>
                <Caption3 color={Colors.TEXT_COLOR}>{label}</Caption3>
                <Caption5 color={Colors.PRIMARY_TEXT}>{value}</Caption5>
            </View>
            <Pressable hitSlop={8}>
                <EditPenIcon size={18} color={Colors.COLOR_ACTIVE} />
            </Pressable>
        </View>
    );
}

export default function AboutMeScreen() {
    return (
        <SafeAreaView style={aboutStyles.safe}>
            <SectionTitle title="About Me" />
            <ScrollView contentContainerStyle={aboutStyles.scroll} showsVerticalScrollIndicator={false}>

                <Body4 color={Colors.COLOR_ACTIVE} style={aboutStyles.sectionLabel}>
                    Public Info:
                </Body4>
                <View style={aboutStyles.card}>
                    {PUBLIC_INFO.map((item, idx) => (
                        <React.Fragment key={item.label}>
                            <InfoRow label={item.label} value={item.value} />
                            {/* {idx < PUBLIC_INFO.length - 1 && <View style={aboutStyles.divider} />} */}
                        </React.Fragment>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const aboutStyles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
    scroll: { paddingBottom: hp(40) },
    sectionLabel: { marginBottom: hp(8), marginTop: hp(16) },
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
        paddingVertical: hp(20),
        gap: wp(8),
        marginBottom:hp(10)
    },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
});