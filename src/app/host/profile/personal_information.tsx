import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

import { EditPenIcon } from '@/assets/icons/common_icon/EditPenIcon';
import { ShieldCheckIcon } from '@/assets/icons/common_icon/ShieldCheckIcon';
import { CameraIcon } from '@/assets/icons/host_icon/CameraIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Caption3, Caption5 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';

// Icons — swap with your actual icon components


// ── Fake data ─────────────────────────────────────────────────────────────────
const PERSONAL_INFO = [
    { label: 'First name:', value: 'Hridoy' },
    { label: 'Last name:', value: 'Hossain' },
    { label: 'Email:', value: 'ann.smith@example.com' },
    { label: 'Phone number:', value: '+49 525 152 1326' },
];

const ADDRESS_INFO = [
    { label: 'Address:', value: 'Hridoy' },
    { label: 'City:', value: 'Berlin' },
    { label: 'Zip code:', value: '10115' },
    { label: 'Country:', value: 'Germany' },
];

// ── Info Row ──────────────────────────────────────────────────────────────────
function InfoRow({
    label,
    value,
    onEdit,
    showDivider,
}: {
    label: string;
    value: string;
    onEdit: () => void;
    showDivider: boolean;
}) {
    return (
        <>
            <Pressable style={styles.infoRow} onPress={onEdit}>
                <View style={styles.infoText}>
                    <Caption5 color={Colors.TEXT_COLOR}>{label}</Caption5>
                    <Caption3 color={Colors.PRIMARY_TEXT}>{value}</Caption3>
                </View>
                <EditPenIcon size={18} color={Colors.TEXT_COLOR} />
            </Pressable>
            {/* {showDivider && <View style={styles.divider} />} */}
        </>
    );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function PersonalInfoScreen() {
    const router = useRouter();
    const [navigating, setNavigating] = useState(false);

    const handleEdit = async (field: string) => {
        setNavigating(true);
        await new Promise((r) => setTimeout(r, 600));
        setNavigating(false);
        // router.push(`/host/profile/edit-field?field=${field}` as any);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Profile" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar row */}
                <View style={styles.avatarRow}>
                    <View style={styles.avatarWrap}>
                        <Image
                            source={IMAGE_COMPONENTS.hostProfile}
                            contentFit="cover"
                            style={styles.avatar}
                        />
                        {/* Camera badge */}
                        <Pressable style={styles.cameraBadge}>
                            <CameraIcon size={16} color={"#0088FF"} />
                        </Pressable>
                    </View>
                    <View style={styles.avatarInfo}>
                        <Body4 color={Colors.PRIMARY_TEXT} weight="semiBold">Hridoy</Body4>
                        <Caption5 color={"#70787B"}>
                            Your personal information is used to manage your account and improve your experience.
                        </Caption5>
                    </View>
                </View>

                {/* Personal Info section */}
                <Body4 color={"#0B1C30"} style={styles.sectionLabel}>
                    Personal Info:
                </Body4>
                <View style={styles.card}>
                    {PERSONAL_INFO.map((item, idx) => (
                        <InfoRow
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            onEdit={() => handleEdit(item.label)}
                            showDivider={idx < PERSONAL_INFO.length - 1}
                        />
                    ))}
                </View>

                {/* Address section */}
                <Body4 color={"#0B1C30"} style={styles.sectionLabel}>
                    Address:
                </Body4>
                <View style={styles.card}>
                    {ADDRESS_INFO.map((item, idx) => (
                        <InfoRow
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            onEdit={() => handleEdit(item.label)}
                            showDivider={idx < ADDRESS_INFO.length - 1}
                        />
                    ))}
                </View>

                {/* Security note */}
                <View style={styles.securityCard}>
                    <View style={styles.securityIcon}>
                        <ShieldCheckIcon size={28} color={Colors.STATUS_COLOR} />
                    </View>
                    <View style={styles.securityText}>
                        <Caption3 color={Colors.PRIMARY_TEXT} weight="semiBold">
                            Security of your information
                        </Caption3>
                        <Caption5 color={Colors.TEXT_COLOR}>
                            We protect your personal data & never share it with third parties
                        </Caption5>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal:wp(20)
    },
    scroll: {
        // paddingHorizontal: wp(20),
        paddingBottom: hp(32),
        paddingTop:hp(20)
    },

    // ── Avatar ────────────────────────────────────────────────────────────────
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(14),
        marginBottom: hp(24),
    },
    avatarWrap: {
        position: 'relative',
    },
    avatar: {
        width: wp(64),
        height: wp(64),
        borderRadius: wp(32),
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: wp(22),
        height: wp(22),
        borderRadius: wp(11),
        backgroundColor: "#FFFFFF",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.APP_BACKGROUND,
    },
    avatarInfo: {
        flex: 1,
        gap: hp(4),
    },

    // ── Section label ─────────────────────────────────────────────────────────
    sectionLabel: {
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: hp(10),
        marginTop: hp(4),
    },

    // ── Card ──────────────────────────────────────────────────────────────────
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,

        // borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
        marginBottom: hp(20),
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        gap: wp(10),
        borderWidth:1,
        borderColor:Colors.BORDER_COLOR,
        borderRadius:14,
        marginBottom:hp(8)
    },
    infoText: {
        flex: 1,
        gap: hp(2),
    },
    divider: {
        height: 1,
        backgroundColor: Colors.BORDER_COLOR,
        marginHorizontal: wp(16),
    },

    // ── Security card ─────────────────────────────────────────────────────────
    securityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.STATUS_COLOR_OPACITY,
        borderRadius: wp(14),
        padding: wp(16),
        gap: wp(12),
    },
    securityIcon: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(10),
        backgroundColor: Colors.INPUT_BACKGROUND,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    securityText: {
        flex: 1,
        gap: hp(2),
    },
});