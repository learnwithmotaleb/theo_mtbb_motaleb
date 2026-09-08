import { useT } from '@/i18n';
import { Body5, Body6, Caption1, Caption3, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateDraft } from '@/redux/slices/accommodationDraftSlice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

import { DownArrowIcon } from '@/assets/icons/common_icon/DownArrowIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { SafeAreaView } from 'react-native-safe-area-context';

const DURATION_OPTIONS = ['1h00', '1h30', '2h00', '2h30', '3h00', '3h30', '4h00', '4h30', '5h00'];

function DurationDropdown({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Pressable
                style={styles.dropdownTrigger}
                onPress={() => setOpen(true)}
            >
                <Body6 color={Colors.PLACEHOLDER_TEXT}>{value}</Body6>
                <DownArrowIcon size={20} color={Colors.TEXT_COLOR} />
            </Pressable>

            <Modal visible={open} transparent animationType="fade">
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setOpen(false)}
                >
                    <View style={styles.dropdownList}>
                        <FlatList
                            data={DURATION_OPTIONS}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        onChange(item);
                                        setOpen(false);
                                    }}
                                >
                                    <Body6
                                        color={
                                            item === value
                                                ? Colors.STATUS_COLOR
                                                : Colors.PRIMARY_TEXT
                                        }
                                    >
                                        {item}
                                    </Body6>
                                </Pressable>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

export default function CleaningDurationScreen() {
    const t = useT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.accommodationDraft);

    const [duration, setDuration] = useState(
        // The duration lives inside the cleaner-facing instructions.
        /\d+h\d+/.exec(draft.instructions)?.[0] ?? '2h30',
    );
    const [rate, setRate] = useState(draft.cleaningRate);
    const [rateError, setRateError] = useState('');
    const [isLoading] = useState(false);

    const handleContinue = () => {
        if (!rate.trim() || Number.isNaN(Number(rate))) {
            setRateError('Proposed rate is required');
            return;
        }
        setRateError('');
        dispatch(
            updateDraft({
                cleaningRate: rate.trim(),
                // There is no duration column; cleaners read it in the brief.
                instructions: `Average cleaning duration: ${duration}`,
            }),
        );
        router.push('/host/onboarding/summary');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle/>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <H2 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    {t("How long does a cleaning take on average?")}
                </H2>
                <Body6 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    {t("This helps us optimize the organization and the rate.")}
                </Body6>

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    {t("Average cleaning duration")}
                </Body5>
                <DurationDropdown value={duration} onChange={setDuration} />

                <Body5 color={Colors.TEXT_COLOR} style={styles.rateQuestion}>
                    {t("What rate would you like to offer?")}
                </Body5>
                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    {t("Proposed rate")}
                </Body5>
                <View style={[styles.inputBox, rateError ? styles.inputError : null]}>
                    <TextInput
                        style={styles.input}
                        value={rate}
                        onChangeText={(t) => {
                            setRate(t);
                            if (t.trim()) setRateError('');
                        }}
                        placeholder={t("80 € / cleaning")}
                        placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                        keyboardType="numeric"
                    />
                </View>
                {rateError ? (
                    <Caption1 color={Colors.COLOR_DANGER} style={styles.errorText}>
                        {rateError}
                    </Caption1>
                ) : null}

                <Caption3 color={Colors.TEXT_COLOR} align="center" style={styles.hint}>
                    {t("You can modify this rate at any time.")}
                </Caption3>
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    // onPress={handleContinue}
                    onPress={handleContinue}
                    title={t("Continue")}
                    backgroundColor={Colors.BG_BLACK}
                    width="100%"
                    height={hp(54)}
                    borderRadius={wp(14)}
                    isLoading={isLoading}
                    disabled={isLoading}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
          paddingHorizontal: wp(20),
    },
    backBtn: {
        marginTop: hp(12),
        marginLeft: wp(20),
        width: wp(32),
    },
    scroll: {
        paddingBottom: hp(20),
    },
    title: {
        marginVertical: hp(10),
    },
    subtitle: {
        paddingHorizontal: wp(10),
        marginBottom: hp(32),
    },
    label: {
        marginBottom: hp(8),
    },
    rateQuestion: {
        marginBottom: hp(4),
        marginTop: hp(8),
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        height: hp(54),
        marginBottom: hp(24),
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        paddingHorizontal: wp(20),
    },
    dropdownList: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        overflow: 'hidden',
        maxHeight: hp(280),
    },
    dropdownItem: {
        paddingVertical: hp(14),
        paddingHorizontal: wp(18),
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_COLOR,
    },
    inputBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        marginBottom: hp(4),
    },
    inputError: {
        borderColor: Colors.COLOR_DANGER,
    },
    input: {
        height: hp(54),
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        fontSize: wp(15),
    },
    errorText: {
        marginBottom: hp(8),
    },
    hint: {
        marginTop: hp(12),
    },
    footer: {
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});