import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { SearchIcon } from '@/assets/icons/common_icon/SearchIcon';
import { Body5, Caption1, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';
import { showToast } from '@/components/shared/Toast';
import { getApiErrorMessage } from '@/lib/apiError';
import { avatarSource, ConversationRow as ConversationRowData, personName, toConversationRow } from '@/lib/mappers';
import { useGetAccommodationsQuery } from '@/redux/services/accommodationApi';
import { useGetConversationsQuery, useStartConversationMutation } from '@/redux/services/chatApi';
import { AppImage } from '@/components/shared/AppImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function HostMessageScreen() {
    const t = useT();
    const router = useRouter();
    const { openConversationId } = useLocalSearchParams<{ openConversationId?: string }>();
    const [search, setSearch] = useState('');

    // Poll while the list is on screen so a new message bumps its row without
    // needing a socket connection.
    const { data, isLoading: isChatLoading, refetch: refetchChat } = useGetConversationsQuery(
        { page: 1, limit: 50 },
        { pollingInterval: 15000 },
    );

    // Host accommodations - so assigned cleaners automatically appear in Messages.
    const { data: accommodationsData, isLoading: isAccLoading, refetch: refetchAccommodations } = useGetAccommodationsQuery(
        { limit: 100 },
        { pollingInterval: 30000 },
    );

    const { refreshing, onRefresh } = useRefresh([refetchChat, refetchAccommodations]);
    const [startConversation] = useStartConversationMutation();

    const conversations = useMemo(() => {
        const rawConvs = (data?.data ?? []).map(toConversationRow);
        const seenCleanerIds = new Set<string>();

        rawConvs.forEach((c) => {
            if (c.otherParticipantId) seenCleanerIds.add(c.otherParticipantId);
        });

        const extraCleaners: ConversationRowData[] = [];
        (accommodationsData?.data ?? []).forEach((acc) => {
            const assigned = (acc.assignedCleaners ?? []) as any[];
            assigned.forEach((entry) => {
                if (entry.status === 'refused') return;
                const cleaner = entry.cleaner ?? (typeof entry === 'object' && entry._id ? entry : null);
                if (!cleaner?._id) return;
                if (seenCleanerIds.has(cleaner._id)) return;
                seenCleanerIds.add(cleaner._id);

                extraCleaners.push({
                    id: `cleaner-${cleaner._id}`,
                    name: personName(cleaner, t('Housekeeper')),
                    image: avatarSource(cleaner.profileImage),
                    lastMessage: t("Tap to start chatting"),
                    time: '',
                    unreadCount: 0,
                    otherParticipantId: cleaner._id,
                });
            });
        });

        return [...rawConvs, ...extraCleaners];
    }, [data, accommodationsData, t]);

    // Deep link (e.g. from a push notification) straight into a thread.
    useEffect(() => {
        if (!openConversationId) return;
        router.push({
            pathname: '/host/message/chat' as any,
            params: { conversationId: openConversationId },
        });
    }, [openConversationId, router]);

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase();
        if (!needle) return conversations;
        return conversations.filter(
            (c) =>
                c.name.toLowerCase().includes(needle) ||
                c.lastMessage.toLowerCase().includes(needle),
        );
    }, [conversations, search]);

    const handleNavigate = useCallback(async (item: ConversationRowData) => {
        if (item.id.startsWith('cleaner-') && item.otherParticipantId) {
            try {
                const conv = await startConversation({ receiverId: item.otherParticipantId }).unwrap();
                router.push({
                    pathname: '/host/message/chat' as any,
                    params: { conversationId: conv._id },
                });
            } catch (err) {
                showToast(getApiErrorMessage(err, t("Could not open the conversation.")), 'error');
            }
            return;
        }

        router.push({
            pathname: '/host/message/chat' as any,
            params: { conversationId: item.id },
        });
    }, [router, startConversation, t]);

    const isLoading = isChatLoading && isAccLoading;

    return (
        <SafeAreaView style={styles.safe}>
            <Body5
                color={Colors.PRIMARY_TEXT}
                style={styles.pageTitle}
            >
                {t("Message")}
            </Body5>

            {/* Search */}
            <View style={styles.searchBox}>
                <SearchIcon size={18} color={Colors.TEXT_COLOR} />
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder={t("Search here..")}
                    placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                />
            </View>

            {/* Conversation list */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    isLoading ? (
                        <SkeletonList count={4} variant="row" />
                    ) : (
                        <Caption3 color={Colors.TEXT_COLOR}>{t("No conversations yet.")}</Caption3>
                    )
                }
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.row}
                        onPress={() => handleNavigate(item)}
                    >
                        <AppImage
                            source={item.image}
                            style={styles.avatar}
                            contentFit="cover"
                        />
                        <View style={styles.rowInfo}>
                            <Caption1 color={Colors.PRIMARY_TEXT}>{item.name}</Caption1>
                            <Caption3
                                color={Colors.TEXT_COLOR}
                                numberOfLines={1}
                            >
                                {item.lastMessage}
                            </Caption3>
                        </View>
                        <Caption3 color={Colors.TEXT_COLOR}>{item.time}</Caption3>
                    </Pressable>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    pageTitle: {
        textAlign: 'center',
        paddingVertical: hp(20),
        fontFamily: 'Poppins_600SemiBold',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(24),
        paddingHorizontal: wp(16),
        height: hp(46),
        marginBottom: hp(16),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    searchInput: {
        flex: 1,
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
    },
    list: { paddingBottom: hp(50) },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:Colors.INPUT_BACKGROUND,
        borderRadius:wp(10),
        marginBottom:hp(6),
        paddingHorizontal:hp(10),
        gap: wp(12),
        paddingVertical: hp(12),
    },
    avatar: {
        width: wp(48),
        height: wp(48),
        borderRadius: wp(24),
        flexShrink: 0,
    },
    rowInfo: {
        flex: 1,
        gap: hp(2),
    },
    separator: {
        // height: 1,
        // backgroundColor: Colors.BORDER_COLOR,
    },
});