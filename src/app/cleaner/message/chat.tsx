import { useT } from '@/i18n';
import { LeftArrowIcon } from '@/assets/icons/common_icon/LeftArrowIcon';
import { PlusCircleIcon } from '@/assets/icons/common_icon/PlusCircleIcon';
import { SendMessageIcon } from '@/assets/icons/common_icon/SendMessageIcon';
import { Body6, Caption1, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { showToast } from '@/components/shared/Toast';
import { useReportConversation } from '@/components/shared/ReportConversation';
import { ChatBubble, useConversation } from '@/hooks/useChat';
import { AppImage } from '@/components/shared/AppImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import {
    Animated,
    FlatList,
    Keyboard,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { fp, hp, wp } from '../../../../utils/responsiveDevice';

export default function CleanerChatScreen() {
    const t = useT();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
    const flatListRef = useRef<FlatList>(null);
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    const {
        header,
        messages,
        inputText,
        setInputText,
        send,
        sendAttachment,
    } = useConversation(conversationId);

    const { openReport, reportModal } = useReportConversation(
        conversationId,
        header.name,
        header.otherParticipantId,
    );

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', (e) => {
            Animated.timing(keyboardHeight, {
                toValue: e.endCoordinates.height,
                duration: 0,
                useNativeDriver: false,
            }).start();
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        });
        const hide = Keyboard.addListener('keyboardDidHide', () => {
            Animated.timing(keyboardHeight, {
                toValue: 0,
                duration: 0,
                useNativeDriver: false,
            }).start();
        });
        return () => { show.remove(); hide.remove(); };
    }, []);

    const handleSend = useCallback(async () => {
        if (!inputText.trim()) return;
        try {
            await send();
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        } catch {
            showToast(t("Message not sent — check your connection."), 'error');
        }
    }, [inputText, send, t]);


    // const shouldShowTime = (index: number) => {
    //     if (index === 0) return true;
    //     return messages[index].time !== messages[index - 1].time;
    // };

    const shouldShowTime = useCallback((index: number) => {
        if (index === 0) return true;
        return messages[index].time !== messages[index - 1].time;
    }, [messages])


    return (
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>

            {/* ── Header ── */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.backBtn}
                >
                    <LeftArrowIcon size={22} color={Colors.PRIMARY_TEXT} />
                </Pressable>
                <AppImage source={header.image} style={styles.headerAvatar} contentFit="cover" />
                <Body6 color={Colors.PRIMARY_TEXT} style={{ flex: 1 }}>{header.name}</Body6>
                {/* Both stores require a way to flag abusive content from
                    inside the conversation itself. */}
                <Pressable
                    onPress={openReport}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Caption1 color={Colors.TEXT_COLOR}>•••</Caption1>
                </Pressable>
            </View>

            {/* ── Animated container — pushes up with keyboard ── */}
            <Animated.View style={[styles.inner, { marginBottom: keyboardHeight }]}>

                {/* ── Messages ── */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messageList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: false })
                    }
                    renderItem={({ item, index }) => (
                        <MessageBubble
                            item={item}
                            showTime={shouldShowTime(index)}
                        />
                    )}
                />

                {/* ── Input bar ── */}
                <View style={[styles.inputBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : hp(12) }]}>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder={t("Type Something . . .")}
                            placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                            multiline
                        />
                        <Pressable onPress={sendAttachment} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <PlusCircleIcon size={24} color={Colors.TEXT_COLOR} />
                        </Pressable>
                    </View>
                    <Pressable
                        style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <SendMessageIcon size={20} color={Colors.TEXT_WHITE} />
                    </Pressable>
                </View>

            </Animated.View>
            {reportModal}
        </SafeAreaView>
    );
}


const MessageBubble = React.memo(function MessageBubble({ item, showTime }: {
    item: ChatBubble,
    showTime: boolean
}) {
    return (
        <View>
            {showTime && (
                <Caption3 color={Colors.TEXT_COLOR} align="center" style={styles.timeLabel}>
                    — {item.time} —
                </Caption3>
            )}
            <View style={[
                styles.bubbleRow,
                item.sender === 'me' ? styles.bubbleRowMe : styles.bubbleRowOther,
            ]}>
                <View style={[
                    styles.bubble,
                    item.sender === 'me' ? styles.bubbleMe : styles.bubbleOther,
                ]}>
                    <Caption1 color={item.sender === 'me' ? Colors.TEXT_WHITE : Colors.PRIMARY_TEXT}>
                        {item.text}
                    </Caption1>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
    },
    inner: {
        flex: 1,
    },

    // ── Header ───────────────────────────────────────────────────────────────
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        paddingHorizontal: wp(20),
        paddingVertical: hp(14),
    },
    backBtn: { marginRight: wp(4) },
    headerAvatar: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
    },

    // ── Messages ──────────────────────────────────────────────────────────────
    messageList: {
        paddingHorizontal: wp(16),
        paddingVertical: hp(16),
        gap: hp(4),
    },
    timeLabel: { marginVertical: hp(12) },
    bubbleRow: { flexDirection: 'row', marginBottom: hp(8) },
    bubbleRowMe: { justifyContent: 'flex-end' },
    bubbleRowOther: { justifyContent: 'flex-start' },
    bubble: {
        maxWidth: '75%',
        borderRadius: wp(24),
        paddingHorizontal: wp(14),
        paddingVertical: hp(10),
    },
    bubbleMe: {
        backgroundColor: '#636363',
        borderBottomRightRadius: wp(2),
    },
    bubbleOther: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderTopLeftRadius: wp(4),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },

    // ── Input bar ─────────────────────────────────────────────────────────────
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: wp(10),
        paddingHorizontal: wp(16),
        paddingTop: hp(12),
        backgroundColor: Colors.APP_BACKGROUND,
    },
    inputBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(24),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        gap: wp(8),
        minHeight: hp(48),
    },
    input: {
        flex: 1,
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        fontSize: fp(14),
        maxHeight: hp(100),
    },
    sendBtn: {
        width: wp(78),
        height: wp(42),
        borderRadius: wp(24),
        backgroundColor: "#006C93",
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: { opacity: 0.5 },
});
