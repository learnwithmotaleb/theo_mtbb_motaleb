import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { ThreeDotsIcon } from '@/assets/icons/host_icon/ThreeDots';
import { CleanerOptionsModal } from '@/components/host/housing/CleanerOptionsModal';
import SectionTitle from '@/components/shared/SectionTitle';
import {
    Body2,
    Body4,
    Caption1,
    Caption2,
    Caption3,
    Caption4,
    Caption5,
} from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { MANAGE_CLEANERS_DATA } from '@/data/hostFakeData';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

type CleanerItem = {
    id: string;
    name: string;
    image: any;
    cleaningsCompleted: number;
    isPrimary?: boolean;
};

// ── CleanerRow ────────────────────────────────────────────────────────────────
function CleanerRow({
    item,
    onMessage,
    onOptions,
}: {
    item: CleanerItem;
    onMessage: () => void;
    onOptions: () => void;
}) {
    const router = useRouter();

    return (
        <View style={mcStyles.cleanerRow}>
            {/* Avatar → housekeeper detail */}
            <Pressable
                onPress={() =>
                    router.push('/host/housing/housekeeper_detail' as any)
                }
            >
                <Image
                    source={item.image}
                    style={mcStyles.avatar}
                    contentFit="cover"
                />
            </Pressable>

            {/* Name + cleanings */}
            <View style={{ flex: 1 }}>
                <Body4 color={Colors.PRIMARY_TEXT}>{item.name}</Body4>
                <Caption4 color={Colors.TEXT_COLOR}>
                    {item.cleaningsCompleted} Cleaning completed
                </Caption4>
            </View>

            
            <Pressable style={mcStyles.messageBtn} onPress={onMessage}>
                <Caption5 color={Colors.TEXT_COLOR}>Message</Caption5>
            </Pressable>

            {/* Options */}
            <Pressable style={mcStyles.dotsBtn} onPress={onOptions}>
                <Caption3 color={Colors.TEXT_COLOR}>
                    <ThreeDotsIcon />
                </Caption3>
            </Pressable>
        </View>
    );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function ManageCleanersScreen() {
    const router = useRouter();
    const data = MANAGE_CLEANERS_DATA;

    const [selectedCleaner, setSelectedCleaner] = useState<CleanerItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleOptions = (cleaner: CleanerItem) => {
        setSelectedCleaner(cleaner);
        setModalVisible(true);
    };

    // cleaner id দিয়ে সরাসরি chat page এ যাওয়া
    // conversationId = 'cleaner_${id}' — messageFakeData এর HOST_CONVERSATIONS এর id এর সাথে match করে
    const handleMessage = (cleanerId: string) => {
        router.push({
            pathname: '/host/message/chat' as any,
            params: { conversationId: `cleaner_${cleanerId}` },
        });
    };

    return (
        <SafeAreaView style={mcStyles.safe}>
            <SectionTitle title="Cleaners" />

            <ScrollView
                contentContainerStyle={mcStyles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Accommodation card */}
                <View style={mcStyles.accomCard}>
                    <Image
                        source={data.accommodation.image}
                        style={mcStyles.accomThumb}
                        contentFit="cover"
                    />
                    <View style={{ flex: 1 }}>
                        <Caption2
                            color={"#8E8E93"}
                            style={{ letterSpacing: 0.6 }}
                        >
                            ACCOMMODATION
                        </Caption2>
                        <Caption1
                            color={Colors.PRIMARY_TEXT}
                            numberOfLines={2}
                        >
                            {data.accommodation.name}
                        </Caption1>
                        <View style={mcStyles.addressRow}>
                            <View style={{ marginTop: hp(5) }}>
                                <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                            </View>
                            <Caption5
                                color={Colors.TEXT_COLOR}
                                numberOfLines={2}
                            >
                                {data.accommodation.address}
                            </Caption5>
                        </View>
                    </View>
                </View>

                {/* Primary cleaner */}
                <Body2 color={Colors.PRIMARY_TEXT} style={mcStyles.sectionTitle}>
                    Primary cleaner
                </Body2>
                <View style={mcStyles.card}>
                    <CleanerRow
                        item={{ ...data.primaryCleaner, isPrimary: true }}
                        onMessage={() => handleMessage(data.primaryCleaner.id)}
                        onOptions={() =>
                            handleOptions({
                                ...data.primaryCleaner,
                                isPrimary: true,
                            })
                        }
                    />
                </View>

                {/* Substitutes */}
                <Body2 color={Colors.PRIMARY_TEXT} style={mcStyles.sectionTitle}>
                    Substitutes
                </Body2>
                <View style={mcStyles.card}>
                    {data.substitutes.map((cleaner) => (
                        <React.Fragment key={cleaner.id}>
                            <CleanerRow
                                item={cleaner}
                                onMessage={() => handleMessage(cleaner.id)}
                                onOptions={() => handleOptions(cleaner)}
                            />
                        </React.Fragment>
                    ))}
                </View>
            </ScrollView>

            <CleanerOptionsModal
                visible={modalVisible}
                isPrimary={selectedCleaner?.isPrimary ?? false}
                onClose={() => setModalVisible(false)}
                onRemove={() => setModalVisible(false)}
                onMakePrimary={() => setModalVisible(false)}
                onMakeSubstitute={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const mcStyles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: { paddingBottom: hp(40) },
    accomCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(12),
        paddingVertical: hp(16),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(8),
        marginBottom: hp(20),
    },
    accomThumb: {
        width: wp(120),
        height: hp(120),
        borderRadius: wp(10),
        marginLeft: 8,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(4),
        marginTop: hp(4),
    },
    sectionTitle: { marginBottom: hp(12) },
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        paddingHorizontal: wp(16),
        marginBottom: hp(20),
    },
    cleanerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        paddingVertical: hp(14),
    },
    avatar: { width: wp(48), height: wp(48), borderRadius: wp(24) },
    messageBtn: {
        paddingHorizontal: wp(8),
        paddingVertical: hp(8),
        borderRadius: wp(8),
        backgroundColor: Colors.APP_BACKGROUND,
    },
    dotsBtn: {
        paddingHorizontal: wp(6),
        paddingVertical: hp(4),
    },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
});