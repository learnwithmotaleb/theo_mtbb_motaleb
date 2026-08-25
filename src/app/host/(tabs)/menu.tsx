import { LockIcon } from '@/assets/icons/common_icon/LockIcon';
import { LogoutIcon } from '@/assets/icons/common_icon/LogoutIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import { FastCleaningIcon } from '@/assets/icons/host_icon/FastCleaningIcon';
import { HeadPhoneIcon } from '@/assets/icons/host_icon/HeadPhoneIcon';
import { InfoIcon } from '@/assets/icons/host_icon/InfoIcon';
import { LanguageIcon } from '@/assets/icons/host_icon/LanguageIcon';
import { LegalNoticeIcon } from '@/assets/icons/host_icon/LegalNoticeIcon';
import { PaymentIcon } from '@/assets/icons/host_icon/PaymentIcon';
import { PrivacyPolicyIcon } from '@/assets/icons/host_icon/PrivecyPolicyIcon';
import { TermsUsesIcon } from '@/assets/icons/host_icon/TermsUsesIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body6, Caption1, Caption3, H3 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function HostMenuScreen() {
    const router = useRouter();

    const HOST_SECTIONS = [
        {
            title: 'ACCOUNT SETTINGS',
            items: [
                { label: 'Personal Information',  icon: <UserIcon />,          route: '/host/profile/personal_information' },
                { label: 'My Past Cleaning',      icon: <FastCleaningIcon />,     route: '/host/profile/past_cleaning' },
                { label: 'Payment Method',        icon: <PaymentIcon />,          route: '/host/profile/payment' },
                { label: 'Password and Security', icon: <LockIcon />, route: '/host/profile/security' },
                { label: 'Language',              icon: <LanguageIcon />,         route: '/host/profile/language' },
                { label: 'Help and Support',      icon: <HeadPhoneIcon  color={"#000000"} />,        route: '/host/profile/help_support' },
            ],
        },
        {
            title: 'LEGAL',
            items: [
                { label: 'About Us',       icon: <InfoIcon />,          route: '/host/profile/about_us' },
                { label: 'Terms of Use',   icon: <TermsUsesIcon />,     route: '/host/profile/terms' },
                { label: 'Privacy Policy', icon: <PrivacyPolicyIcon />, route: '/host/profile/privacy' },
                { label: 'Legal Notice',   icon: <LegalNoticeIcon />,   route: '/host/profile/legal_notice' },
            ],
        },
    ];

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Profile" />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Avatar */}
                <View style={styles.profileHeader}>
                    <Image
                        source={IMAGE_COMPONENTS.hostProfile}
                        contentFit='cover'
                        style={styles.avatar}
                    />
                    <H3 color={Colors.PRIMARY_TEXT} style={styles.name}>Hridoy</H3>
                </View>

                {HOST_SECTIONS.map((sec) => (
                    <View key={sec.title} style={styles.section}>
                        <Caption1 color={"#00000080"} style={styles.sectionTitle}>
                            {sec.title}
                        </Caption1>
                        <View style={styles.card}>
                            {sec.items.map((item, idx) => (
                                <React.Fragment key={item.label}>
                                    <Pressable
                                        style={styles.menuRow}
                                        onPress={() => router.push(item.route as any)}
                                    >
                                        <View style={styles.iconWrapper}>
                                            {item.icon}
                                        </View>
                                        <Caption3 color={"#4B4B4B"} style={{ flex: 1 }}>
                                            {item.label}
                                        </Caption3>
                                        <RightAngleIcon />
                                    </Pressable>
                                    {/* {idx < sec.items.length - 1 && <View style={styles.divider} />} */}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                ))}

                <Pressable
                    style={styles.logoutRow}
                    onPress={() =>
                        Alert.alert('Logout', 'Are you sure?', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Logout', style: 'destructive', onPress: () => router.replace('/(auth)/login' as any) },
                        ])
                    }
                >
                    <LogoutIcon/>
                    <Body6 color={Colors.TEXT_COLOR}>Log out</Body6>
                </Pressable>
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
    scroll: { paddingBottom: hp(120) },
    profileHeader: {
        alignItems: 'center',
        marginVertical: hp(24),
        gap: hp(8),
    },
    avatar: {
        width: wp(72),
        height: wp(72),
        borderRadius: wp(36),
    },
    name: { fontFamily: 'Poppins_600SemiBold' },
    section: { marginBottom: hp(16) },
    sectionTitle: { marginBottom: hp(8), letterSpacing: 0.6 },
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(16),
        paddingVertical: hp(16),
        gap: wp(12),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        borderRadius: wp(14),
        marginBottom: hp(8),
    },
    iconWrapper: {
        width: wp(32),
        height: wp(32),
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.BORDER_COLOR,
        marginHorizontal: wp(16),
    },
    logoutRow: {
        padding: hp(10),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        borderWidth : 1,
        borderRadius: wp(10),
        borderColor: Colors.BORDER_COLOR,
        // alignItems: 'center',
    },
        
});