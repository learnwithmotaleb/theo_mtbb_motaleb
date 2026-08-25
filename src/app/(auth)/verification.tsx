import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body6, Caption3, H1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { hp, wp } from '../../../utils/responsiveDevice';

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 30;

export default function VerificationScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
    const [canResend, setCanResend] = useState(false);

    const maskedEmail = 'j****@gmail.com';

    // Countdown timer
    useEffect(() => {
        if (countdown === 0) {
            setCanResend(true);
            return;
        }
        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleResend = () => {
        if (!canResend) return;
        console.log('Resend OTP');
        setOtp(Array(OTP_LENGTH).fill(''));
        setCountdown(RESEND_COUNTDOWN);
        setCanResend(false);
        inputRefs.current[0]?.focus();
    };

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

    const handleVerify = () => {
        const code = otp.join('');
        console.log('OTP submitted:', code);
        router.push('/(auth)/new_password' as any);
    };

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.root}
            >
                <View style={styles.header}>
                    <SectionTitle title="Verification" />
                </View>

                <View style={styles.content}>
                    <H1 color={Colors.PRIMARY_TEXT} align="center" style={styles.title}>
                        Enter Verification Code
                    </H1>
                    <Body6 color={Colors.TEXT_COLOR} align="center" style={styles.description}>
                        We've sent a 6-digit code{'\n'}{maskedEmail}
                    </Body6>

                    {/* OTP boxes */}
                    <View style={styles.otpRow}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputRefs.current[index] = ref; }}
                                style={[
                                    styles.otpBox,
                                    digit ? styles.otpBoxFilled : styles.otpBoxEmpty,
                                ]}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                textContentType="oneTimeCode"
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Resend OTP */}
                    <View style={styles.resendRow}>
                        <Body6 color={Colors.TEXT_COLOR}>
                            Didn't receive the code?{' '}
                        </Body6>
                        <Pressable onPress={handleResend} disabled={!canResend}>
                            <Caption3
                                color={canResend ? Colors.BRAND_PRIMARY : Colors.TEXT_COLOR}
                                style={[styles.resendText, !canResend && styles.resendDisabled]}
                            >
                                {canResend ? 'Resend' : `Resend in ${countdown}s`}
                            </Caption3>
                        </Pressable>
                    </View>
                    {/* Bottom button */}
                    <View style={styles.footer}>
                        <CustomButton
                            title="Verify"
                            onPress={handleVerify}
                            width="100%"
                            height={hp(56)}
                            borderRadius={14}
                            backgroundColor={Colors.BG_BLACK}
                        />
                    </View>
                </View>


            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
        paddingTop: hp(20),
    },
    header: {
        marginBottom: hp(8),
    },
    content: {
        flex: 1,
        paddingTop: hp(24),
    },
    title: {
        marginBottom: hp(8),
    },
    description: {
        marginBottom: hp(40),
        lineHeight: hp(22),
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
    },
    otpBox: {
        width: wp(48),
        height: wp(52),
        borderRadius: 12,
        borderWidth: 1.5,
        textAlign: 'center',
        fontSize: hp(18),
        fontFamily: 'Poppins_600SemiBold',
        color: Colors.PRIMARY_TEXT,
    },
    otpBoxEmpty: {
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.INPUT_BACKGROUND,
    },
    otpBoxFilled: {
        borderColor: Colors.BRAND_PRIMARY,
        backgroundColor: Colors.BRAND_PRIMARY,
        color: Colors.TEXT_WHITE,
    },
    resendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(20),
    },
    resendText: {
        fontFamily: 'Poppins_600SemiBold',
    },
    resendDisabled: {
        opacity: 0.5,
    },
    footer: {
        paddingTop: hp(32),
    },
});