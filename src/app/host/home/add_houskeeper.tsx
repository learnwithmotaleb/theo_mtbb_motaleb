
import { SearchIcon } from '@/assets/icons/common_icon/SearchIcon';
import { FilterIconSearch } from '@/assets/icons/host_icon/FilterIconsearch';
import { HousekeeperCard } from '@/components/host/home/housekeeper/HousekeeperCard';
import { HousekeeperDetail } from '@/components/host/home/housekeeper/HousekeeperDetail';
import { RequestSentModal } from '@/components/host/home/housekeeper/RequestSentModal';
import { SelectAccommodation } from '@/components/host/home/housekeeper/SelectAccommodation';
import CustomLoader from '@/components/shared/CustomLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { ACCOMMODATIONS, HOUSEKEEPERS } from '@/data/hostFakeData';
import { Housekeeper } from '@/types/dataTypes';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Step = 'list' | 'detail' | 'accommodation';

export default function AddHousekeeperScreen() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('list');
    const [selectedHK, setSelectedHK] = useState<Housekeeper | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState('');

    const filtered = HOUSEKEEPERS.filter((h) =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase())
    );

    const goTo = (nextStep: Step) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(nextStep);
        }, 800);
    };

    const handleSelectHK = (hk: Housekeeper) => {
        setSelectedHK(hk);
        goTo('detail');
    };

    const handleAddHousekeeper = () => {
        goTo('accommodation');
    };

    const handleSendRequest = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setModalVisible(true);
        }, 800);
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
                                placeholder="Enter Housekeeper Name or City Name"
                                placeholderTextColor={Colors.TEXT_COLOR}
                                value={search}
                                onChangeText={setSearch}
                            />
                            <FilterIconSearch />
                        </View>

                        <Body4 color={Colors.TEXT_COLOR} style={styles.nearbyLabel}>
                            Housekeepers near by you
                        </Body4>

                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <HousekeeperCard item={item} onPress={handleSelectHK} />
                            )}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.list}
                            ListFooterComponent={
                                <View style={styles.trustedBox}>
                                    <Body4 color={Colors.PRIMARY_TEXT}>Trusted professionals</Body4>
                                    <Caption4 color={Colors.TEXT_COLOR}>
                                        All our housekeepers are verified and rated to guarantee you a quality service.
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
                            Select an accommodation
                        </Body4>
                        <Caption3 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(16) }}>
                            Choose the accommodation for which you wish to clean.
                        </Caption3>
                        <SelectAccommodation
                            accommodations={ACCOMMODATIONS}
                            housekeeperName={selectedHK?.name ?? 'Léa'}
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
                onClose={() => setModalVisible(false)}
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