// components/Profiles/SecurityScreen.tsx
import { useT } from '@/i18n';
import { LightIcon } from '@/assets/icons/common_icon/LightIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { SecurityIcon } from '@/assets/icons/common_icon/SecurityIcon';
import { TrashIcon } from '@/assets/icons/common_icon/TrashIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { showToast } from '@/components/shared/Toast';
import { FormInput } from '@/components/inputForm/inputForm';
import { Body5, Body6, Caption1, Caption2, Caption3, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { useCurrentUser } from '@/redux/hooks';
import {
    useChangePasswordMutation,
    useDeleteMyAccountMutation,
} from '@/redux/services/authApi';
import {
    useGetBlockedUsersQuery,
    useUnblockUserMutation,
} from '@/redux/services/miscApi';
import { personName } from '@/lib/mappers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
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
    icon?: React.ReactNode;
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
    const t = useT();
    const router = useRouter();
    const me = useCurrentUser();

    const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation();
    const [deleteAccount, { isLoading: isDeleting }] = useDeleteMyAccountMutation();

    const [passwordOpen, setPasswordOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Deleting an account requires the password, so it gets its own prompt.
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    const closePasswordModal = () => {
        setPasswordOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast(t("Please fill in all fields"), 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast(t("Passwords do not match"), 'error');
            return;
        }
        try {
            const res = await changePassword({
                currentPassword,
                newPassword,
                confirmPassword,
            }).unwrap();
            showToast(res.message ?? t("Password updated"), 'success');
            closePasswordModal();
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not change the password.")), 'error');
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            showToast(t("Enter your password to confirm"), 'error');
            return;
        }
        try {
            await deleteAccount({ password: deletePassword }).unwrap();
            setDeleteOpen(false);
            setDeletePassword('');
            showToast(t("Your account has been deleted"), 'success');
            router.replace('/(auth)/login' as never);
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not delete the account.")), 'error');
        }
    };

    // Blocking has to be reversible from somewhere outside the conversation,
    // since a blocked thread is exactly what the user can no longer open.
    const { data: blocked } = useGetBlockedUsersQuery();
    const [unblockUser] = useUnblockUserMutation();

    const handleUnblock = (userId: string, label: string) => {
        Alert.alert(t("Unblock {name}?", { name: label }), t("You will be able to message each other again."), [
            { text: t("Cancel"), style: 'cancel' },
            {
                text: t("Unblock"),
                onPress: async () => {
                    try {
                        await unblockUser(userId).unwrap();
                        showToast(t("{name} has been unblocked.", { name: label }), 'success');
                    } catch (err) {
                        showToast(
                            getApiErrorMessage(err, t("Could not unblock this user.")),
                            'error',
                        );
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t("Security")} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.iconCircle}>
                    <SecurityIcon size={32} color={Colors.TEXT_COLOR} />
                </View>

                <H2 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    {t("Your account is secure")}
                </H2>
                <Body6 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    {t("We do everything we can to protect your personal information.")}
                </Body6>

                {/* CONNECTION */}
                <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                    {t("CONNECTION")}
                </Caption2>
                <View style={styles.card}>
                    <Row
                        title={t("Change password")}
                        subtitle={t("Choose a strong password")}
                        onPress={() => setPasswordOpen(true)}
                    />
                </View>

                {/* BLOCKED PEOPLE */}
                <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                    {t("BLOCKED PEOPLE")}
                </Caption2>
                <View style={styles.card}>
                    {(blocked ?? []).length === 0 ? (
                        <Row
                            title={t("No one is blocked")}
                            subtitle={t("Block someone from the ••• menu in a conversation")}
                            onPress={() => {}}
                        />
                    ) : (
                        (blocked ?? []).map((person, idx) => (
                            <React.Fragment key={person._id}>
                                {idx > 0 && <View style={styles.divider} />}
                                <Row
                                    title={personName(person, 'Blocked user')}
                                    subtitle={t("Tap to unblock")}
                                    onPress={() =>
                                        handleUnblock(
                                            person._id,
                                            personName(person, 'This user'),
                                        )
                                    }
                                />
                            </React.Fragment>
                        ))
                    )}
                </View>

                {/* ACCOUNT RECOVERY */}
                <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                    {t("ACCOUNT RECOVERY")}
                </Caption2>
                <View style={styles.card}>
                    <Row
                        title={t("Recovery email")}
                        subtitle={me?.email ?? t("Not set")}
                        onPress={() => router.push('/(auth)/forgot_password' as never)}
                    />
                    <View style={styles.divider} />
                    <Row
                        title={t("Recovery phone")}
                        subtitle={me?.phone ?? t("Not set")}
                        onPress={() =>
                            router.push(
                                (me?.role === 'cleaner'
                                    ? '/cleaner/profile/personal_info'
                                    : '/host/profile/personal_information') as never,
                            )
                        }
                    />
                </View>


                <View style={[styles.card, { marginTop: hp(12) }]}>
                    <Row
                        title={t("Learn how to protect your account and avoid unauthorized access")}
                        onPress={() =>
                            router.push(
                                (me?.role === 'cleaner'
                                    ? '/cleaner/profile/privacy'
                                    : '/host/profile/privacy') as never,
                            )
                        }
                        icon={<LightIcon size={28} color={Colors.PRIMARY_TEXT} />}
                    />
                </View>


                <Caption1 color={Colors.COLOR_DANGER} style={styles.sectionLabel}>
                    {t("DANGER ZONE")}
                </Caption1>
                <View style={styles.card}>
                    <Row
                        title={t("Delete my account")}
                        subtitle={t("Permanently delete your account with your all data")}
                        danger
                        icon={<Text style={styles.emoji}>
                            <TrashIcon/>
                        </Text>}
                        onPress={() =>
                            Alert.alert(t("Delete Account"), t("Are you sure?"), [
                                { text: t("Cancel"), style: 'cancel' },
                                {
                                    text: t("Delete"),
                                    style: 'destructive',
                                    onPress: () => setDeleteOpen(true),
                                },
                            ])
                        }
                    />
                </View>
            </ScrollView>

            {/* ── Change password ── */}
            <Modal visible={passwordOpen} transparent animationType="fade">
                <Pressable style={styles.backdrop} onPress={closePasswordModal}>
                    <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                        <Body5 color={Colors.PRIMARY_TEXT} style={styles.sheetTitle}>
                            {t("Change password")}
                        </Body5>

                        <FormInput
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            type="password"
                            placeholder={t("Current password")}
                        />
                        <View style={{ height: hp(10) }} />
                        <FormInput
                            value={newPassword}
                            onChangeText={setNewPassword}
                            type="password"
                            placeholder={t("New password")}
                        />
                        <View style={{ height: hp(10) }} />
                        <FormInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            type="password"
                            placeholder={t("Confirm new password")}
                        />

                        <Caption3 color={Colors.TEXT_COLOR} style={styles.hint}>
                            {t("At least 8 characters, with one uppercase letter, one number and one special character.")}
                        </Caption3>

                        <CustomButton
                            title={t("Update password")}
                            onPress={handleChangePassword}
                            disabled={isChanging}
                            isLoading={isChanging}
                            width="100%"
                            height={hp(50)}
                            borderRadius={wp(8)}
                        />
                    </Pressable>
                </Pressable>
            </Modal>

            {/* ── Delete account ── */}
            <Modal visible={deleteOpen} transparent animationType="fade">
                <Pressable style={styles.backdrop} onPress={() => setDeleteOpen(false)}>
                    <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                        <Body5 color={Colors.COLOR_DANGER} style={styles.sheetTitle}>
                            {t("Delete my account")}
                        </Body5>
                        <Caption3 color={Colors.TEXT_COLOR} style={styles.hint}>
                            {t("Enter your password to confirm. This cannot be undone.")}
                        </Caption3>
                        <FormInput
                            value={deletePassword}
                            onChangeText={setDeletePassword}
                            type="password"
                            placeholder={t("Your password")}
                        />
                        <View style={{ height: hp(14) }} />
                        <CustomButton
                            title={t("Delete permanently")}
                            onPress={handleDeleteAccount}
                            disabled={isDeleting}
                            isLoading={isDeleting}
                            backgroundColor={Colors.COLOR_DANGER}
                            width="100%"
                            height={hp(50)}
                            borderRadius={wp(8)}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
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
        backgroundColor: Colors.STATUS_COLOR_OPACITY,
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

    // ── Modals ────────────────────────────────────────────────────────────────
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        paddingHorizontal: wp(20),
    },
    sheet: {
        backgroundColor: Colors.APP_BACKGROUND,
        borderRadius: wp(16),
        padding: wp(20),
    },
    sheetTitle: { marginBottom: hp(14) },
    hint: { marginVertical: hp(10) },
});
