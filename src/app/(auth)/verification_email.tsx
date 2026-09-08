import { useT } from '@/i18n';
import { EmailIcon } from '@/assets/icons/common_icon/EmailIcon';
import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import { StepIndicator } from '@/components/shared/StepIndicator';
import Toast, { showToast } from '@/components/shared/Toast';
import { Body6, Caption3, H1 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { useResendOtpMutation, useVerifyOtpMutation } from '@/redux/services/authApi';
import { AppImage } from '@/components/shared/AppImage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fp, hp, wp } from '../../../utils/responsiveDevice';

const OTP_LENGTH = 4;
const RESEND_SECONDS = 60;

export default function VerificationEmailScreen() {
    const t = useT();
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const [timer, setTimer] = useState(RESEND_SECONDS);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

    // ── Timer ─────────────────────────────────────────────────────────────────
    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimer(RESEND_SECONDS);
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        // Page load হলেই timer শুরু
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleChange = (text: string, index: number) => {
        const cleaned = text.replace(/[^0-9]/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[index] = cleaned;
        setOtp(newOtp);
        if (cleaned && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = async () => {
        if (!email || timer > 0) return;
        try {
            const res = await resendOtp({ email }).unwrap();
            if (res.success) {
                showToast(t("OTP resent to your email"), 'success');
                setOtp(Array(OTP_LENGTH).fill(''));
                inputRefs.current[0]?.focus();
                startTimer(); // timer reset করুন
            }
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Failed to resend OTP")), 'error');
        }
    };

    const handleContinue = async () => {
        const code = otp.join('');
        if (code.length < OTP_LENGTH) {
            showToast(t("Please enter the complete OTP"), 'error');
            return;
        }
        if (!email) return;

        try {
            // verifyOtp persists the onboarding token and seeds the auth
            // slice itself (authApi onQueryStarted) — this screen just routes.
            const res = await verifyOtp({ email, otp: code }).unwrap();
            showToast(res.message ?? t("Email verified!"), 'success');
            setTimeout(() => {
                router.push('/(auth)/role_select' as any);
            }, 800);
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Invalid OTP. Please try again.")), 'error');
        }
    };

    const isLoading = isVerifying || isResending;
    const canResend = timer === 0 && !isResending;

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.APP_BACKGROUND }}>
                <Toast />
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

                    <View style={{ marginTop: hp(10) }}>
                        <StepIndicator
                            totalSteps={4}
                            currentStep={2}
                            activeColor={Colors.BRAND_PRIMARY}
                            inactiveColor={Colors.BRAND_PRIMARY}
                        />
                    </View>

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.content}>
                            <AppImage
                                source={IMAGE_COMPONENTS.emailImage}
                                style={styles.imageEmail}
                                contentFit="contain"
                            />

                            <H1 color={Colors.PRIMARY_TEXT} style={styles.title}>
                                {t("Verification E-mail")}
                            </H1>
                            <Body6 color={Colors.TEXT_COLOR} style={styles.description}>
                                {t("We have sent to a code to")}
                            </Body6>
                            <Body6 color={Colors.PRIMARY_TEXT} style={styles.emailText}>
                                {email}
                            </Body6>

                            {/* Email display row */}
                            <View style={styles.fieldGroup}>
                                <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                                    {t("Email")}
                                </Body6>
                                <View style={styles.emailRow}>
                                    <View style={styles.emailIconWrapper}>
                                        <EmailIcon />
                                    </View>
                                    <Body6 color={Colors.PRIMARY_TEXT} style={styles.emailValue}>
                                        {email}
                                    </Body6>
                                    <Pressable onPress={() => router.back()}>
                                        <Caption3 color={"#35A9D6"}>{t("Modify?")}</Caption3>
                                    </Pressable>
                                </View>
                            </View>

                            {/* OTP boxes */}
                            <Caption3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                                {t("Type here code")}
                            </Caption3>
                            <View style={styles.otpRow}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => { inputRefs.current[index] = ref; }}
                                        style={[styles.otpBox, digit ? styles.otpBoxFilled : styles.otpBoxEmpty]}
                                        value={digit}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        textContentType="oneTimeCode"
                                        selectTextOnFocus
                                        editable={!isLoading}
                                    />
                                ))}
                            </View>

                            {/* Resend + Timer */}
                            <View style={styles.resendRow}>
                                {/* বাম দিকে timer */}
                                {timer > 0 ? (
                                    <Caption3 color={Colors.BRAND_PRIMARY}>
                                        {t("Resend in {n}s", { n: timer })}
                                    </Caption3>
                                ) : (
                                    <View /> // placeholder যাতে resend right এ থাকে
                                )}

                                {/* ডান দিকে resend button */}
                                <Pressable
                                    onPress={handleResend}
                                    disabled={!canResend}
                                >
                                    <Caption3
                                        color={canResend ? Colors.PRIMARY_TEXT : Colors.TEXT_COLOR}
                                        style={[
                                            styles.resendText,
                                            !canResend && { opacity: 0.4 }
                                        ]}
                                    >
                                        {isResending ? 'Resending...' : 'Resend Code'}
                                    </Caption3>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Bottom button */}
                    <View style={styles.footer}>
                        <CustomButton
                            title={isVerifying ? '' : 'Continue'}
                            onPress={handleContinue}
                            width="100%"
                            height={hp(52)}
                            borderRadius={14}
                            disabled={isLoading}
                        />
                        {isVerifying && (
                            <View style={styles.loaderOverlay}>
                                <CustomLoader size={32} strokeWidth={2} />
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: wp(20),
        paddingTop: hp(20),
    },
    topRow: {
        marginTop: hp(20),
        marginBottom: hp(30),
    },
    backBtn: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        backgroundColor: "#FFFFFF",
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    content: { flex: 1 },
    imageEmail: {
        width: wp(160),
        height: hp(124),
        alignSelf: 'center',
        marginVertical: hp(10),
    },
    title: { marginBottom: hp(4) },
    description: {},
    emailText: { marginBottom: hp(16) },
    fieldGroup: { marginBottom: hp(12) },
    label: {
        marginBottom: hp(6),
        marginLeft: wp(2),
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        backgroundColor: Colors.INPUT_BACKGROUND,
    },
    emailIconWrapper: { marginRight: wp(10) },
    emailValue: { flex: 1 },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(12),
    },
    otpBox: {
        width: wp(60),
        height: wp(60),
        borderRadius: 10,
        borderWidth: 1.5,
        textAlign: 'center',
        fontSize: fp(16),
        fontFamily: 'Poppins_600SemiBold',
        color: Colors.PRIMARY_TEXT,
    },
    otpBoxEmpty: {
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.INPUT_BACKGROUND,
    },
    otpBoxFilled: {
        borderColor: Colors.BRAND_PRIMARY,
        backgroundColor: Colors.INPUT_BACKGROUND,
        color: Colors.PRIMARY_TEXT,
    },
    resendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(8),
    },
    resendText: { textDecorationLine: 'underline' },
    footer: { position: 'relative' },
    loaderOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});