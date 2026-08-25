import { CleanerAvtIcon } from '@/assets/icons/cleaner_icon/CleanerAvtIcon';
import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { HostAvtIcon } from '@/assets/icons/host_icon/HostAvtIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body6, Caption3, H1, H3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useAppDispatch } from '@/redux/hooks';
import { setRole } from '@/redux/slices/authSlice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../utils/responsiveDevice';

type Role = 'host' | 'cleaner';

interface RoleOption {
    id: Role;
    title: string;
    description: string;
    IconComponent: React.FC;
}

const ROLES: RoleOption[] = [
    {
        id: 'host',
        title: "I'm a host",
        description: 'Choose your profile to get started',
        IconComponent: HostAvtIcon,
    },
    {
        id: 'cleaner',
        title: "I'm a cleaner",
        description: 'I organize my cleaning service',
        IconComponent: CleanerAvtIcon,
    },
];

export default function RoleSelectScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedRole, setSelectedRole] = useState<Role | null>('host');

    const handleContinue = () => {
        if (!selectedRole) return;

        dispatch(setRole(selectedRole));

        if (selectedRole === 'host') {
            router.push('/host/onboarding/welcome_host' as any);
        } else {
            router.push('/cleaner/onboarding/housekeeper_welcome' as any);
        }
    };

    return (
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
                currentStep={4}
                activeColor={Colors.BRAND_PRIMARY}
                inactiveColor={Colors.BRAND_PRIMARY}
            />

            <View style={styles.content}>
                <H1 color={Colors.PRIMARY_TEXT} style={styles.title}>
                    How do you use Gestilo?
                </H1>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.description}>
                    Choose your profile to get started
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
                            <View style={styles.avatarCircle}>
                                <role.IconComponent />
                            </View>
                            <H3 color={Colors.PRIMARY_TEXT} style={styles.cardTitle}>
                                {role.title}
                            </H3>
                            <Body6 color={Colors.TEXT_COLOR} style={styles.cardDesc}>
                                {role.description}
                            </Body6>
                        </Pressable>
                    );
                })}
                <View style={styles.footer}>
                    <CustomButton
                        title="Continue"
                        onPress={handleContinue}
                        width="100%"
                        height={hp(56)}
                        borderRadius={8}
                    />
                </View>
            </View>


        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
        paddingTop: hp(30),
    },
    topRow: { marginBottom: hp(30) },
    backBtn: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    content: { flex: 1, marginTop: hp(20) },
    title: { marginBottom: hp(6) },
    description: { marginBottom: hp(24) },
    card: {
        alignItems: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: Colors.BORDER_COLOR,
        paddingVertical: hp(24),
        paddingHorizontal: wp(16),
        marginBottom: hp(16),
    },
    cardSelected: { borderColor: Colors.BRAND_PRIMARY },
    radioWrapper: { position: 'absolute', top: hp(14), right: wp(14) },
    avatarCircle: {
        width: wp(72),
        height: wp(72),
        borderRadius: wp(36),
        backgroundColor: '#EAF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(12),
    },
    cardTitle: { marginBottom: hp(4), fontWeight: '500' },
    cardDesc: { textAlign: 'center' },
    radio: {
        width: wp(20),
        height: wp(20),
        borderRadius: wp(10),
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
    footer: {
        //  paddingBottom: hp(32)
    },
});