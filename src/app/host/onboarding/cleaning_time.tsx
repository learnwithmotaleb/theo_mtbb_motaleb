import { useT } from '@/i18n';
import { DownArrowIcon } from '@/assets/icons/common_icon/DownArrowIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Body5, Body6, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { arrivalOptionsAfter, DEPARTURE_TIME_OPTIONS } from '@/constants/accommodation';
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
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';


function TimeDropdown({
    prefix,
    value,
    options,
    onChange,
}: {
    prefix: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
}) {
    const t = useT();
    const [open, setOpen] = useState(false);

    return (
        <>
            <Pressable
                style={styles.dropdownTrigger}
                onPress={() => setOpen(true)}
            >
                <Body6 color={Colors.PLACEHOLDER_TEXT}>
                    {t(prefix)} :{' '}
                    <Body6 color={Colors.PRIMARY_TEXT}>{value}</Body6>
                </Body6>
                <DownArrowIcon size={20} color={Colors.TEXT_COLOR} />
            </Pressable>

            <Modal visible={open} transparent animationType="fade">
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setOpen(false)}
                >
                    <View style={styles.dropdownList}>
                        <FlatList
                            data={options}
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

/**
 * Any saved value -> "HH:mm". Accepts "9:00" / "09:00" and, for drafts made
 * before the switch to 24-hour, "4:00 PM". Anything else uses the fallback.
 */
const toClock = (value: string | undefined, fallback: string): string => {
    const v = (value ?? '').trim();
    const ampm = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(v);
    if (ampm) {
        let hour = Number(ampm[1]) % 12;
        if (ampm[3].toUpperCase() === 'PM') hour += 12;
        return `${String(hour).padStart(2, '0')}:${ampm[2]}`;
    }
    const clock = /^(\d{1,2}):(\d{2})/.exec(v);
    if (clock) return `${clock[1].padStart(2, '0')}:${clock[2]}`;
    return fallback;
};

export default function CleaningTimeScreen() {
    const t = useT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.accommodationDraft);

    // The window a cleaning can happen in: guests leave at check-out and the
    // next ones arrive at check-in.
    const [startTime, setStartTime] = useState(toClock(draft.checkOutTime, '10:00'));
    const [endTime, setEndTime] = useState(toClock(draft.checkInTime, '16:00'));
    const [isLoading] = useState(false);

    // The slot ends after it starts: a later start pushes the end to the
    // first time that still follows it.
    const changeStart = (value: string) => {
        setStartTime(value);
        if (endTime <= value) setEndTime(arrivalOptionsAfter(value)[0] ?? endTime);
    };

    const handleContinue = () => {
        // Drafts saved before this check could hold an end before the start.
        if (endTime <= startTime) {
            setEndTime(arrivalOptionsAfter(startTime)[0] ?? endTime);
            showToast(t("The next guests must arrive after the departure time."), 'error');
            return;
        }
        dispatch(
            updateDraft({
                checkOutTime: startTime,
                checkInTime: endTime,
            }),
        );
        router.push('/host/onboarding/cleaning_duration');
    };

    return (
        <SafeAreaView style={styles.safe}>
          
          <SectionTitle/>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <H2 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    {t("When should the cleaning take place?")}
                </H2>
                <Body6 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    {t("Indicate the full time range so that the housekeepers can locate you.")}
                </Body6>

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    {t("Preferred time slot")}
                </Body5>

                <TimeDropdown
                    prefix="Between"
                    value={startTime}
                    options={DEPARTURE_TIME_OPTIONS}
                    onChange={changeStart}
                />
                <TimeDropdown
                    prefix="And"
                    value={endTime}
                    options={arrivalOptionsAfter(startTime)}
                    onChange={setEndTime}
                />

                <View style={styles.infoCard}>
                    <ClockIcon size={22} color={Colors.STATUS_COLOR} />
                    <Body6 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {t("The housekeeper will intervene within this time slot based on their availability.")}
                    </Body6>
                </View>
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
        marginBottom: hp(10),
    },
    subtitle: {
        paddingHorizontal: wp(10),
        marginBottom: hp(28),
    },
    label: {
        marginBottom: hp(10),
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
        marginBottom: hp(12),
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
        maxHeight: hp(300),
    },
    dropdownItem: {
        paddingVertical: hp(14),
        paddingHorizontal: wp(18),
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_COLOR,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        gap: wp(12),
        marginTop: hp(8),
    },
    infoText: {
        flex: 1,
    },
    footer: {
        // paddingHorizontal: wp(20),
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});