import { useT } from '@/i18n';
import { CleanerAvtIcon } from '@/assets/icons/cleaner_icon/CleanerAvtIcon';
import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { HostAvtIcon } from '@/assets/icons/host_icon/HostAvtIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { showToast } from '@/components/shared/Toast';
import { Body1, Caption3, H1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getLocalizedAuthErrorMessage } from '@/lib/apiError';
import { useAppDispatch } from '@/redux/hooks';
import { useSelectRoleMutation } from '@/redux/services/authApi';
import { setRole } from '@/redux/slices/authSlice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsiveDevice';

type RoleType = 'host' | 'cleaner';

// Light blue fill for the chosen option (client mock-up).
const SELECTED_CARD_BG = '#EAF4FF';

interface RoleOption {
    id: RoleType;
    title: string;
    icon: React.ReactElement;
}

// Two simple options, title only (client request). To use the designer's
// illustrations later, swap `icon` for <AppImage source={...} /> here.
const ROLE_ICON_SIZE = wp(56);

const ROLES: RoleOption[] = [
    {
        id: 'host',
        title: "I'm a host",
        icon: <HostAvtIcon size={ROLE_ICON_SIZE} />,
    },
    {
        id: 'cleaner',
        title: "I'm a cleaner",
        icon: <CleanerAvtIcon size={ROLE_ICON_SIZE} />,
    },
];

export default function RoleSelectScreen() {
    const t = useT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedRole, setSelectedRole] = useState<RoleType>('host');
    const [selectRole, { isLoading }] = useSelectRoleMutation();

    const handleContinue = async () => {
        try {
            const res = await selectRole({ role: selectedRole }).unwrap();
            if (res.success) {
                dispatch(setRole(selectedRole));
                showToast(t("Role selected!"), 'success');
                setTimeout(() => {
                    router.push('/(auth)/complete_information' as any);
                }, 800);
            }
        } catch (err) {
            showToast(getLocalizedAuthErrorMessage(err, t("Failed to select role. Try again.")), 'error');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.root}
            >

                <View style={styles.topRow}>
                    <Pressable
                        onPress={() => router.back()}
                        style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
                        hitSlop={8}
                    >
                        <LeftAngleIcon />
                    </Pressable>
                </View>

                <StepIndicator
                    totalSteps={4}
                    currentStep={3}
                    activeColor={Colors.BRAND_PRIMARY}
                    inactiveColor={Colors.BRAND_PRIMARY}
                />

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <H1 color={Colors.PRIMARY_TEXT} style={styles.title}>
                            {t("How do you use Gestilo?")}
                        </H1>
                        <Caption3 color={Colors.TEXT_COLOR} style={styles.description}>
                            {t("Choose your profile to continue")}
                        </Caption3>

                        {ROLES.map((role) => {
                            const isSelected = selectedRole === role.id;
                            return (
                                <Pressable
                                    key={role.id}
                                    style={[styles.card, isSelected && styles.cardSelected]}
                                    onPress={() => setSelectedRole(role.id)}
                                >
                                    <View style={styles.radioWrapper}>
                                        <View style={[styles.radio, isSelected && styles.radioSelected]}>
                                            {isSelected && <View style={styles.radioDot} />}
                                        </View>
                                    </View>
                                    <View style={[styles.avatarCircle, isSelected && styles.avatarCircleSelected]}>
                                        {role.icon}
                                    </View>
                                    <Body1
                                        color={Colors.PRIMARY_TEXT}
                                        align="center"
                                        style={styles.cardTitle}
                                    >
                                        {t(role.title)}
                                    </Body1>
                                </Pressable>
                            );
                        })}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <CustomButton
                        title={isLoading ? '' : t('Continue')}
                        onPress={handleContinue}
                        width="100%"
                        height={hp(56)}
                        borderRadius={8}
                        disabled={isLoading}
                    />
                    {isLoading && (
                        <View style={styles.loaderOverlay}>
                            <CustomLoader size={32} strokeWidth={2} />
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
    },
    root: {
        flex: 1,
        paddingHorizontal: wp(20),
        paddingTop: hp(30),
    },
    topRow: { marginBottom: hp(16) },
    backBtn: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    content: { flex: 1, marginTop: hp(10) },
    title: { marginBottom: hp(4) },
    description: { marginBottom: hp(16) },
    card: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: Colors.BORDER_COLOR,
        paddingVertical: hp(24),
        // Wide side padding keeps the title clear of the radio button.
        paddingHorizontal: wp(40),
        marginBottom: hp(14),
    },
    cardSelected: {
        borderColor: Colors.BRAND_PRIMARY,
        backgroundColor: SELECTED_CARD_BG,
    },
    radioWrapper: { position: 'absolute', top: hp(12), right: wp(12) },
    avatarCircle: {
        width: wp(96),
        height: wp(96),
        borderRadius: wp(48),
        backgroundColor: '#EAF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(14),
    },
    avatarCircleSelected: { backgroundColor: '#FFFFFF' },
    cardTitle: { alignSelf: 'stretch' },
    radio: {
        width: wp(18),
        height: wp(18),
        borderRadius: wp(9),
        borderWidth: 2,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.INPUT_BACKGROUND,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: { borderColor: Colors.BRAND_PRIMARY },
    radioDot: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        backgroundColor: Colors.BRAND_PRIMARY,
    },
    footer: { position: 'relative', paddingBottom: hp(16), paddingTop: hp(8) },
    loaderOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});