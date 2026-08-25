// components/shared/SecurityScreen.tsx
import { LightIcon } from '@/assets/icons/common_icon/LightIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { SecurityIcon } from '@/assets/icons/common_icon/SecurityIcon';
import { TrashIcon } from '@/assets/icons/common_icon/TrashIcon';
import { Body6, Caption1, Caption2, Caption3, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsiveDevice';
import SectionTitle from '../shared/SectionTitle';

// ── Row ───────────────────────────────────────────────────────────────────────
function Row({
    title,
    subtitle,
    onPress,
    danger = false,
    icon,
}: {
    title: string;
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
    icon?: React.ReactNode;   // ✅ string → ReactNode
}) {
    return (
        <Pressable style={styles.row} onPress={onPress}>
            {icon && (
                <View style={styles.rowIcon}>
                  
                    {icon}
                </View>
            )}
            <View style={styles.rowText}>
                <Body6 color={danger ? Colors.COLOR_DANGER : Colors.PRIMARY_TEXT}>
                    {title}
                </Body6>
                {subtitle && (
                    <Caption3 color={danger ? Colors.COLOR_DANGER : Colors.TEXT_COLOR}>
                        {subtitle}
                    </Caption3>
                )}
            </View>
           
            <RightAngleIcon size={28} color={Colors.TEXT_COLOR} />
        </Pressable>
    );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export function SecurityScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Security" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
               
                <View style={styles.iconCircle}>
                    <SecurityIcon size={32} color={Colors.TEXT_COLOR} />
                </View>

                <H2 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    Your account is secure
                </H2>
                <Body6 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    We do everything we can to protect your personal information.
                </Body6>

                {/* CONNECTION */}
                <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                    CONNECTION
                </Caption2>
                <View style={styles.card}>
                    <Row
                        title="Change password"
                        subtitle="Choose a strong password"
                        onPress={() => {}}
                    />
                </View>

                {/* ACCOUNT RECOVERY */}
                <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                    ACCOUNT RECOVERY
                </Caption2>
                <View style={styles.card}>
                    <Row
                        title="Recovery email"
                        subtitle="ann.smith@example.com"
                        onPress={() => {}}
                    />
                    <View style={styles.divider} />
                    <Row
                        title="Recovery phone"
                        subtitle="+33 6 12 34 56 78"
                        onPress={() => {}}
                    />
                </View>

               
                <View style={[styles.card, { marginTop: hp(12) }]}>
                    <Row
                        title="Learn how to protect your account and avoid unauthorized access"
                        onPress={() => {}}
                        icon={<LightIcon size={28} color={Colors.PRIMARY_TEXT} />}
                    />
                </View>

               
                <Caption1 color={Colors.COLOR_DANGER} style={styles.sectionLabel}>
                    DANGER ZONE
                </Caption1>
                <View style={styles.card}>
                    <Row
                        title="Delete my account"
                        subtitle="Permanently delete your account with your all data"
                        danger
                        icon={<Text style={styles.emoji}>
                            <TrashIcon/>
                        </Text>}
                        onPress={() =>
                            Alert.alert('Delete Account', 'Are you sure?', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: () => {} },
                            ])
                        }
                    />
                </View>
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
    scroll: {
        paddingBottom: hp(32),
    },

    // ── Hero ──────────────────────────────────────────────────────────────────
    iconCircle: {
        alignSelf: 'center',
        width: wp(72),
        height: wp(72),
        borderRadius: wp(36),
        backgroundColor: Colors.STATUS_COLOR_OPACITY,  // ✅ hardcoded color সরানো
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(16),
        marginTop: hp(8),
    },
    title: { marginBottom: hp(6) },
    subtitle: { marginBottom: hp(24), paddingHorizontal: wp(10) },

    // ── Section label ─────────────────────────────────────────────────────────
    sectionLabel: {
        marginBottom: hp(8),
        marginTop: hp(16),
        letterSpacing: 0.8,
    },

    // ── Card ──────────────────────────────────────────────────────────────────
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        overflow: 'hidden',
    },

    // ── Row ───────────────────────────────────────────────────────────────────
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(16),
        paddingVertical: hp(16),
        gap: wp(12),
    },
    rowIcon: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        backgroundColor: "#F4F4F5",
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowText: {
        flex: 1,
        gap: hp(2),
    },
    divider: {
        height: 1,
        backgroundColor: Colors.BORDER_COLOR,
        marginHorizontal: wp(16),
    },
    emoji: {
        fontSize: wp(18),
        backgroundColor:"#F4F4F5",
    },
});