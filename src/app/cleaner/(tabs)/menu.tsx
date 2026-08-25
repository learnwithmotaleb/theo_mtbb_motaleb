import { ClientsIcon } from '@/assets/icons/cleaner_icon/clientsIcon';
import { PaymentMethodIcon } from '@/assets/icons/cleaner_icon/PaymentMethodIcon';
import { RevenueIcon } from '@/assets/icons/cleaner_icon/RevenueIcon';
import { LockIcon } from '@/assets/icons/common_icon/LockIcon';
import { LogoutIcon } from '@/assets/icons/common_icon/LogoutIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import { HeadPhoneIcon } from '@/assets/icons/host_icon/HeadPhoneIcon';
import { InfoIcon } from '@/assets/icons/host_icon/InfoIcon';
import { LanguageIcon } from '@/assets/icons/host_icon/LanguageIcon';
import { LegalNoticeIcon } from '@/assets/icons/host_icon/LegalNoticeIcon';
import { PrivacyPolicyIcon } from '@/assets/icons/host_icon/PrivecyPolicyIcon';
import { TermsUsesIcon } from '@/assets/icons/host_icon/TermsUsesIcon';
import { Body5, Body6, Caption1, Caption3, Caption5 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function CleanerMenuScreen() {
    const router = useRouter();
    const [isAvailable, setIsAvailable] = useState(true);

    const CLEANER_SECTIONS = [
        {
            title: 'ACCOUNT SETTINGS',
            items: [
                { label: 'Personal Information', icon: <UserIcon />, route: '/cleaner/profile/personal_info' },
                { label: 'My Clients', icon: <ClientsIcon />, route: '/cleaner/profile/my_clients' },
                { label: 'Revenue', icon: <RevenueIcon />, route: '/cleaner/profile/revenue' },
                { label: 'Payment Method', icon: <PaymentMethodIcon />, route: '/cleaner/profile/payment' },
                { label: 'Password and Security', icon: <LockIcon />, route: '/cleaner/profile/security' },
                { label: 'Language', icon: <LanguageIcon />, route: '/cleaner/profile/language' },
                { label: 'Help and Support', icon: <HeadPhoneIcon color={"#000000"} />, route: '/cleaner/profile/help_support' },
            ],
        },
        {
            title: 'INFORMATION LEGAL',
            items: [
                { label: 'About Us', icon: <InfoIcon />, route: '/cleaner/profile/about_us' },
                { label: 'Terms of Use', icon: <TermsUsesIcon />, route: '/cleaner/profile/terms' },
                { label: 'Privacy Policy', icon: <PrivacyPolicyIcon />, route: '/cleaner/profile/privacy' },
                { label: 'Legal Notice', icon: <LegalNoticeIcon />, route: '/cleaner/profile/legal_notice' },
            ],
        },
    ];

    return (
        <SafeAreaView style={styles.safe}>
            <Body5 color={Colors.PRIMARY_TEXT} style={styles.pageTitle}>Profile</Body5>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                <Pressable
                    style={styles.profileHeader}
                    onPress={() => router.push('/cleaner/profile/about_me' as any)}
                >
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Image
                            source={IMAGE_COMPONENTS.cleanerPP}
                            style={{ height: 60, width: 60 }}
                            contentFit="cover"
                        />
                    </View>
                    <View style={styles.profileText}>
                        <Body5 color={Colors.PRIMARY_TEXT} style={styles.name}>Sophie Martin</Body5>
                        <Caption5 color={Colors.TEXT_COLOR}>Housekeeper</Caption5>
                    </View>
                    <RightAngleIcon size={28} />
                </Pressable>

                {/* Availability toggle — card style */}
                <View style={styles.availRow}>
                    <Body6 color={Colors.TEXT_COLOR}>Available for new request</Body6>
                    <Switch
                        value={isAvailable}
                        onValueChange={setIsAvailable}
                        trackColor={{ false: Colors.BORDER_COLOR, true: Colors.COLOR_ACTIVE }}
                        thumbColor="#fff"
                        ios_backgroundColor={Colors.BORDER_COLOR}
                    />
                </View>

                {/* Sections */}
                {CLEANER_SECTIONS.map((sec) => (
                    <View key={sec.title} style={styles.section}>
                        <Caption1 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
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
                                        <View style={{ flex: 1 }}>
                                            <Caption3 color={Colors.PRIMARY_TEXT}>{item.label}</Caption3>
                                        </View>
                                        <RightAngleIcon />
                                    </Pressable>
                                    {/* {idx < sec.items.length - 1 && <View style={styles.divider} />} */}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout */}
                <Pressable
                    style={styles.logoutRow}
                    onPress={() =>
                        Alert.alert('Logout', 'Are you sure?', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Logout', style: 'destructive', onPress: () => router.replace('/(auth)/login' as any) },
                        ])
                    }
                >
                    <LogoutIcon />
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
    },
    pageTitle: {
        textAlign: 'center',
        paddingVertical: hp(20),
        fontFamily: 'Poppins_600SemiBold',
    },
    scroll: {
        paddingHorizontal: wp(20),
        paddingBottom: hp(32),
    },

    // ── Profile header ────────────────────────────────────────────────────────
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        marginBottom: hp(16),
    },
    avatar: {
        width: wp(52),
        height: wp(52),
        borderRadius: wp(26),
    },
    avatarPlaceholder: { backgroundColor: Colors.BORDER_COLOR },
    profileText: { flex: 1 },
    name: { fontFamily: 'Poppins_600SemiBold' },

    // ── Availability toggle ───────────────────────────────────────────────────
    availRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        marginBottom: hp(16),
    },

    // ── Section ───────────────────────────────────────────────────────────────
    section: { marginBottom: hp(16) },
    sectionTitle: { marginBottom: hp(8), letterSpacing: 0.6 },

    // ── Card ──────────────────────────────────────────────────────────────────
    card: {
        // backgroundColor: Colors.INPUT_BACKGROUND,
        // borderRadius: wp(14),
        // marginBottom:hp(10)
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
    },

    // ── Menu row ──────────────────────────────────────────────────────────────
    menuRow: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        marginBottom: hp(6),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(16),
        paddingVertical: hp(16),
        gap: wp(12),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR
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

    // ── Logout ────────────────────────────────────────────────────────────────
    logoutRow: {
        paddingVertical: hp(16),
        backgroundColor: Colors.INPUT_BACKGROUND,
        paddingHorizontal: wp(24),
        borderRadius: wp(8),
        flexDirection: "row",
        gap: wp(12),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        marginBottom: hp(50)
    },
});