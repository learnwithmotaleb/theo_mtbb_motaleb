import { FormDropdown } from '@/components/host/housing/FormDropdown';
import { AppImage } from '@/components/shared/AppImage';
import { CustomButton } from '@/components/shared/CustomButton';
import { MonthCalendar } from '@/components/shared/MonthCalendar';
import SectionTitle from '@/components/shared/SectionTitle';
import { SkeletonList } from '@/components/shared/Skeleton';
import { showToast } from '@/components/shared/Toast';
import { Body4, Body6, Caption2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useIntlLocale, useT } from '@/i18n';
import { getApiErrorMessage } from '@/lib/apiError';
import { cleaningWindow, formatClock, toDateKey } from '@/lib/datetime';
import { avatarSource, personName } from '@/lib/mappers';
import { useGetAccommodationsQuery } from '@/redux/services/accommodationApi';
import { useGetAccommodationCleanersQuery } from '@/redux/services/assignmentApi';
import { useCreateScheduleMutation } from '@/redux/services/scheduleApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

// Half-hour steps across a working day.
const TIME_OPTIONS = Array.from({ length: 33 }, (_, i) => {
    const minutes = 6 * 60 + i * 30; // 06:00 → 22:00
    const h = String(Math.floor(minutes / 60)).padStart(2, '0');
    const m = String(minutes % 60).padStart(2, '0');
    return `${h}:${m}`;
});

const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};

/**
 * Manual scheduling: the host picks the property, the day, the cleaner's
 * arrival and departure times and the cleaner. Unlike "Recommended cleaning",
 * nothing is imposed — it works without any iCal calendar connected.
 */
export default function ScheduleCleaningScreen() {
    const t = useT();
    const locale = useIntlLocale();
    const router = useRouter();
    const params = useLocalSearchParams<{ accommodationId?: string }>();

    const { data: accommodationPage, isLoading: isLoadingAccommodations } =
        useGetAccommodationsQuery({ page: 1, limit: 100 });
    const accommodations = useMemo(() => accommodationPage?.data ?? [], [accommodationPage]);

    const [pickedAccommodationId, setPickedAccommodationId] = useState(params.accommodationId ?? '');
    const [date, setDate] = useState('');
    const [pickedArrival, setArrival] = useState('');
    const [pickedDeparture, setDeparture] = useState('');
    const [pickedCleanerId, setCleanerId] = useState('');
    const [notes, setNotes] = useState('');

    // With a single property there is nothing to choose.
    const accommodationId =
        pickedAccommodationId || (accommodations.length === 1 ? accommodations[0]._id : '');
    const accommodation = accommodations.find((a) => a._id === accommodationId);

    // `currentData` is only ever this property's cleaners — never the previous
    // property's while the new request is in flight.
    const { currentData: assignments, isFetching: isLoadingCleaners } =
        useGetAccommodationCleanersQuery(accommodationId, { skip: !accommodationId });

    const accepted = useMemo(
        () =>
            (assignments ?? [])
                .filter((a) => a.status === 'accepted' && a.cleaner && typeof a.cleaner === 'object')
                // Primary first, then substitutes.
                .sort((a, b) => (a.role === 'primary' ? -1 : b.role === 'primary' ? 1 : 0)),
        [assignments],
    );
    const pending = useMemo(
        () => (assignments ?? []).filter((a) => a.status === 'pending'),
        [assignments],
    );

    // Until the host picks times, the property's usual turnover slot (guest
    // check-out → next check-in) is suggested. Both stay freely editable.
    const suggested = accommodation
        ? cleaningWindow(
              formatClock(accommodation.checkOutTime),
              formatClock(accommodation.checkInTime),
          )
        : { arrival: '', departure: '' };
    const arrival =
        pickedArrival || (TIME_OPTIONS.includes(suggested.arrival) ? suggested.arrival : '');
    const departure =
        pickedDeparture || (TIME_OPTIONS.includes(suggested.departure) ? suggested.departure : '');

    // The primary cleaner is preselected; any accepted cleaner can be chosen.
    const cleanerId = accepted.some((a) => (a.cleaner as any)._id === pickedCleanerId)
        ? pickedCleanerId
        : ((accepted[0]?.cleaner as any)?._id ?? '');

    const selectAccommodation = (id: string) => {
        setPickedAccommodationId(id);
        setArrival('');
        setDeparture('');
        setCleanerId('');
    };

    const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation();

    const validate = (): string | null => {
        if (!accommodationId) return t('Choose a property first.');
        if (!date) return t('Choose the date of the cleaning.');
        if (date < toDateKey(new Date())) return t('The date cannot be in the past.');
        if (!arrival || !departure) return t('Choose the arrival and departure times.');
        if (toMinutes(departure) <= toMinutes(arrival)) {
            return t('The departure time must be after the arrival time.');
        }
        if (date === toDateKey(new Date())) {
            const now = new Date();
            if (toMinutes(arrival) <= now.getHours() * 60 + now.getMinutes()) {
                return t('The arrival time has already passed today.');
            }
        }
        if (!cleanerId) return t('Choose the cleaner.');
        return null;
    };

    const handleSubmit = async () => {
        if (isCreating) return;
        const problem = validate();
        if (problem) {
            showToast(problem, 'error');
            return;
        }
        try {
            const schedule = await createSchedule({
                accommodationId,
                cleanerId,
                date,
                // Same convention as the accommodation and every schedule the
                // app has created so far: the cleaning starts at the guest's
                // check-out and ends by the next guest's check-in. Screens
                // order the two by clock time, so they always read arrival first.
                checkOutTime: arrival,
                checkInTime: departure,
                notes: notes.trim() || undefined,
            }).unwrap();
            router.replace({
                pathname: '/host/payment/payment_type',
                params: { scheduleId: schedule._id, accommodationId },
            } as any);
        } catch (err) {
            showToast(getApiErrorMessage(err, t('Could not create the schedule.')), 'error');
        }
    };

    const renderCleaners = () => {
        if (!accommodationId) {
            return (
                <Caption3 color={Colors.TEXT_COLOR}>
                    {t('Choose a property to see its cleaners.')}
                </Caption3>
            );
        }
        if (isLoadingCleaners && !assignments) return <SkeletonList count={1} variant="row" />;
        if (accepted.length === 0) {
            return (
                <View style={{ gap: hp(10) }}>
                    <Caption3 color={Colors.TEXT_COLOR}>
                        {pending.length > 0
                            ? t('Invitation sent – waiting for acceptance. The cleaner must accept before you can send a cleaning request.')
                            : t('No cleaner is assigned to this property yet.')}
                    </Caption3>
                    {pending.length === 0 && (
                        <CustomButton
                            title={t('Assign a cleaner')}
                            onPress={() =>
                                router.push({
                                    pathname: '/host/home/add_houskeeper',
                                    params: { accommodationId },
                                } as any)
                            }
                            width="100%"
                            backgroundColor={Colors.PRIMARY_TEXT}
                            color="#fff"
                            borderRadius={wp(8)}
                            height={hp(46)}
                        />
                    )}
                </View>
            );
        }
        return accepted.map((assignment) => {
            const cleaner = assignment.cleaner as any;
            const selected = cleaner._id === cleanerId;
            return (
                <Pressable
                    key={assignment._id}
                    style={[styles.cleanerRow, selected && styles.cleanerRowSelected]}
                    onPress={() => setCleanerId(cleaner._id)}
                >
                    <AppImage
                        source={avatarSource(cleaner.profileImage)}
                        style={styles.avatar}
                        contentFit="cover"
                    />
                    <View style={{ flex: 1 }}>
                        <Body6 color={Colors.PRIMARY_TEXT}>{personName(cleaner, t('Housekeeper'))}</Body6>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {assignment.role === 'primary' ? t('Primary cleaner') : t('Substitute')}
                        </Caption3>
                    </View>
                    <View style={[styles.radio, selected && styles.radioSelected]}>
                        {selected && <View style={styles.radioDot} />}
                    </View>
                </Pressable>
            );
        });
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t('Schedule a cleaning')} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Property */}
                {isLoadingAccommodations ? (
                    <SkeletonList count={1} variant="row" />
                ) : accommodations.length === 0 ? (
                    <View style={styles.section}>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {t('Add an accommodation before scheduling a cleaning.')}
                        </Caption3>
                    </View>
                ) : (
                    <FormDropdown
                        label={t('Property')}
                        placeholder={t('Choose a property')}
                        value={accommodationId}
                        options={accommodations.map((a) => a._id)}
                        getLabel={(id) => accommodations.find((a) => a._id === id)?.name ?? ''}
                        onChange={selectAccommodation}
                    />
                )}

                {/* Date */}
                <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                    {t('Date')}
                </Body6>
                <MonthCalendar value={date} onChange={setDate} />

                {/* Times */}
                <View style={[styles.timeRow, { marginTop: hp(20) }]}>
                    <View style={{ flex: 1 }}>
                        <FormDropdown
                            label={t('Arrival')}
                            placeholder="--:--"
                            value={arrival}
                            options={TIME_OPTIONS}
                            getLabel={(v) => v}
                            onChange={setArrival}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormDropdown
                            label={t('Departure')}
                            placeholder="--:--"
                            value={departure}
                            options={TIME_OPTIONS}
                            getLabel={(v) => v}
                            onChange={setDeparture}
                        />
                    </View>
                </View>

                {/* Cleaner */}
                <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                    {t('Cleaner')}
                </Body6>
                <View style={[styles.section, { gap: hp(8) }]}>{renderCleaners()}</View>

                {/* Notes */}
                <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                    {t('Notes (optional)')}
                </Body6>
                <View style={styles.section}>
                    <TextInput
                        style={styles.notes}
                        placeholder={t('Instructions for this cleaning')}
                        placeholderTextColor={Colors.TEXT_COLOR}
                        multiline
                        maxLength={500}
                        value={notes}
                        onChangeText={setNotes}
                        textAlignVertical="top"
                    />
                </View>

                {accommodation && date && arrival && departure ? (
                    <View style={styles.section}>
                        <Caption2 color={Colors.TEXT_COLOR}>{t('SUMMARY')}</Caption2>
                        <Body4 color={Colors.PRIMARY_TEXT}>{accommodation.name}</Body4>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {new Date(`${date}T00:00:00`).toLocaleDateString(locale, {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })}
                            {' · '}
                            {arrival} → {departure}
                        </Caption3>
                    </View>
                ) : null}
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title={isCreating ? t('Scheduling...') : t('Next')}
                    onPress={handleSubmit}
                    disabled={isCreating || accepted.length === 0}
                    width="100%"
                    backgroundColor={accepted.length > 0 ? Colors.PRIMARY_TEXT : Colors.BORDER_COLOR}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
    scroll: { paddingTop: hp(10), paddingBottom: hp(40) },
    label: { marginBottom: hp(8), fontFamily: 'Poppins_500Medium' },
    section: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        padding: wp(14),
        marginBottom: hp(20),
    },
    timeRow: { flexDirection: 'row', gap: wp(12) },
    cleanerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        padding: wp(8),
        borderRadius: wp(10),
    },
    cleanerRowSelected: { backgroundColor: '#F0F9FF' },
    avatar: { width: wp(44), height: wp(44), borderRadius: wp(22) },
    radio: {
        width: wp(22),
        height: wp(22),
        borderRadius: wp(11),
        borderWidth: 2,
        borderColor: Colors.BORDER_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: { borderColor: '#0088FF' },
    radioDot: { width: wp(11), height: wp(11), borderRadius: wp(6), backgroundColor: '#0088FF' },
    notes: {
        minHeight: hp(80),
        fontSize: 13,
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        padding: 0,
    },
    footer: { paddingBottom: hp(10), backgroundColor: Colors.APP_BACKGROUND },
});
