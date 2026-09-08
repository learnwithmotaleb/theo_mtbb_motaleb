import { useT } from '@/i18n';
import { DownArrowIcon } from '@/assets/icons/common_icon/DownArrowIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Body6, H2 } from '@/components/typo/Typography';
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
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const TIME_OPTIONS = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

function TimeDropdown({
    prefix,
    value,
    onChange,
}: {
    prefix: string;
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
                <Body6 color={Colors.PLACEHOLDER_TEXT}>
                    {prefix}:{' '}
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
                            data={TIME_OPTIONS}
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

/** "4:00 PM" -> "16:00", the "HH:mm" the accommodation model stores. */
const to24h = (label: string): string => {
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(label.trim());
    if (!match) return label;
    let hour = Number(match[1]) % 12;
    if (match[3].toUpperCase() === 'PM') hour += 12;
    return `${String(hour).padStart(2, '0')}:${match[2]}`;
};

/** The inverse, so returning to this screen preselects what was saved. */
const to12h = (value: string, fallback: string): string => {
    const match = /^(\d{2}):(\d{2})$/.exec(value ?? '');
    if (!match) return fallback;
    const hour = Number(match[1]);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const display = hour % 12 === 0 ? 12 : hour % 12;
    return `${display}:${match[2]} ${suffix}`;
};

export default function CleaningTimeScreen() {
    const t = useT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.accommodationDraft);

    // The window a cleaning can happen in: guests leave at check-out and the
    // next ones arrive at check-in.
    const [startTime, setStartTime] = useState(to12h(draft.checkOutTime, '10:00 AM'));
    const [endTime, setEndTime] = useState(to12h(draft.checkInTime, '4:00 PM'));
    const [isLoading] = useState(false);

    const handleContinue = () => {
        dispatch(
            updateDraft({
                checkOutTime: to24h(startTime),
                checkInTime: to24h(endTime),
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

                <TimeDropdown prefix="Between" value={startTime} onChange={setStartTime} />
                <TimeDropdown prefix="And" value={endTime} onChange={setEndTime} />

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