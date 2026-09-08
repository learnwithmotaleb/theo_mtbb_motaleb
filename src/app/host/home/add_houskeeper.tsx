
import { useFormat } from '@/lib/useFormat';
import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { SearchIcon } from '@/assets/icons/common_icon/SearchIcon';
import { FilterIconSearch } from '@/assets/icons/host_icon/FilterIconsearch';
import { HousekeeperCard } from '@/components/host/home/housekeeper/HousekeeperCard';
import { HousekeeperDetail } from '@/components/host/home/housekeeper/HousekeeperDetail';
import { RequestSentModal } from '@/components/host/home/housekeeper/RequestSentModal';
import { SelectAccommodation } from '@/components/host/home/housekeeper/SelectAccommodation';
import CustomLoader from '@/components/shared/CustomLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Caption3, Caption4 } from '@/components/typo/Typography';
import { showToast } from '@/components/shared/Toast';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { accommodationPhoto, toUiHousekeeper } from '@/lib/mappers';

import { useAssignCleanerMutation, useFindHousekeepersQuery } from '@/redux/services/assignmentApi';
import { useGetAccommodationsQuery } from '@/redux/services/accommodationApi';
import { Accommodation } from '@/types/dataTypes';
import { Housekeeper } from '@/types/dataTypes';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Step = 'list' | 'detail' | 'accommodation';

export default function AddHousekeeperScreen() {
    const t = useT();
    const { formatMoney } = useFormat();
    const router = useRouter();
    const [step, setStep] = useState<Step>('list');
    const [selectedHK, setSelectedHK] = useState<Housekeeper | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState('');

    // The backend does the searching (name + intervention zone), so the field
    // is sent as ?search rather than filtered on the device.
    const { data: housekeepers, isFetching: isSearching } = useFindHousekeepersQuery({
        search: search.trim() || undefined,
        page: 1,
        limit: 50,
    });

    // Only needed once the host reaches the accommodation step.
    const { data: accommodationPage, isFetching: isLoadingAccommodations } =
        useGetAccommodationsQuery(
            { page: 1, limit: 50 },
            { skip: step !== 'accommodation' },
        );

    const [assignCleaner, { isLoading: isAssigning }] = useAssignCleanerMutation();

    const filtered = useMemo(
        () => (housekeepers?.data ?? []).map(toUiHousekeeper),
        [housekeepers],
    );

    const accommodations = useMemo<Accommodation[]>(
        () =>
            (accommodationPage?.data ?? []).map((item) => ({
                id: item._id,
                name: item.name,
                location: item.city || item.address || '',
                price: formatMoney(item.cleaningRate),
                image: accommodationPhoto(item),
            })),
        [accommodationPage],
    );

    const loading = isSearching || isLoadingAccommodations || isAssigning;

    const handleSelectHK = (hk: Housekeeper) => {
        setSelectedHK(hk);
        setStep('detail');
    };

    const handleAddHousekeeper = () => {
        setStep('accommodation');
    };

    // Sending the request creates a pending assignment; the cleaner sees it in
    // their Requests tab and accepts or refuses from there.
    const handleSendRequest = async (selected: Accommodation) => {
        if (!selectedHK) return;
        try {
            await assignCleaner({
                accommodationId: selected.id,
                cleanerId: selectedHK.id,
                role: 'primary',
            }).unwrap();
            setModalVisible(true);
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not send the request.")), 'error');
        }
    };

    const getTitleByStep = (): string => {
        switch (step) {
            case 'list': return 'Housekeepers';
            case 'detail': return 'Housekeeper';
            case 'accommodation': return 'Accommodation';
        }
    };

    const handleBack = () => {
        if (step === 'detail') { setStep('list'); return; }
        if (step === 'accommodation') { setStep('detail'); return; }
        router.back();
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle
                title={getTitleByStep()}
                showBackButton
                containerStyle={{ paddingHorizontal: wp(20) }}
            />

            <View style={styles.content}>
                {/* ── Step 1: List ── */}
                {step === 'list' && (
                    <>
                        {/* Search bar */}
                        <View style={styles.searchBar}>
                            <SearchIcon size={16} color={Colors.TEXT_COLOR} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder={t("Enter Housekeeper Name or City Name")}
                                placeholderTextColor={Colors.TEXT_COLOR}
                                value={search}
                                onChangeText={setSearch}
                            />
                            <FilterIconSearch />
                        </View>

                        <Body4 color={Colors.TEXT_COLOR} style={styles.nearbyLabel}>
                            {t("Housekeepers near by you")}
                        </Body4>

                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <HousekeeperCard item={item} onPress={handleSelectHK} />
                            )}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.list}
                            ListEmptyComponent={
                                isSearching ? (
                                    <SkeletonList count={4} variant="row" />
                                ) : (
                                    <Caption4 color={Colors.TEXT_COLOR}>
                                        {t("No housekeeper matches this search.")}
                                    </Caption4>
                                )
                            }
                            ListFooterComponent={
                                <View style={styles.trustedBox}>
                                    <Body4 color={Colors.PRIMARY_TEXT}>{t("Trusted professionals")}</Body4>
                                    <Caption4 color={Colors.TEXT_COLOR}>
                                        {t("All our housekeepers are verified and rated to guarantee you a quality service.")}
                                    </Caption4>
                                </View>
                            }
                        />
                    </>
                )}

                {/* ── Step 2: Detail ── */}
                {step === 'detail' && selectedHK && (
                    <HousekeeperDetail
                        data={selectedHK}
                        onAddHousekeeper={handleAddHousekeeper}
                    />
                )}

                {/* ── Step 3: Select Accommodation ── */}
                {step === 'accommodation' && (
                    <>
                        <Body4 color={Colors.PRIMARY_TEXT} style={{ marginBottom: hp(4) }}>
                            {t("Select an accommodation")}
                        </Body4>
                        <Caption3 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(16) }}>
                            {t("Choose the accommodation for which you wish to clean.")}
                        </Caption3>
                        <SelectAccommodation
                            accommodations={accommodations}
                            housekeeperName={selectedHK?.name ?? t("The housekeeper")}
                            onSendRequest={handleSendRequest}
                        />
                    </>
                )}
            </View>

            {/* Full screen loader */}
            {loading && (
                <View style={styles.loaderOverlay}>
                    <CustomLoader size={60} strokeWidth={4} />
                </View>
            )}

            {/* Modal */}
            <RequestSentModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    router.back();
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    content: { flex: 1, paddingHorizontal: wp(20) },

    // Search
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        paddingHorizontal: wp(14),
        paddingVertical: hp(10),
        marginBottom: hp(16),
        marginTop: hp(5),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    searchInput: {
        flex: 1,
        fontSize: 12,
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
    },
    nearbyLabel: {
        marginVertical: hp(8)
    },
    list: { paddingBottom: hp(40) },
    trustedBox: {
        backgroundColor: '#0909890D',
        borderRadius: wp(10),
        padding: wp(14),
        gap: hp(4),
        marginTop: hp(16),
    },

    // Loader
    loaderOverlay: {
        ...StyleSheet.absoluteFill, // Modern cross-platform approach
        backgroundColor: '#ffffff80',
        alignItems: 'center',
        justifyContent: 'center',
    },
});