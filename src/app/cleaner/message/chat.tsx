import { LeftArrowIcon } from '@/assets/icons/common_icon/LeftArrowIcon';
import { PlusCircleIcon } from '@/assets/icons/common_icon/PlusCircleIcon';
import { SendMessageIcon } from '@/assets/icons/common_icon/SendMessageIcon';
import { Body6, Caption1, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { CLEANER_CONVERSATIONS } from '@/data/messagefakedata';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
    const flatListRef = useRef<FlatList>(null);
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    const conversation = CLEANER_CONVERSATIONS.find((c) => c.id === conversationId);
    const [messages, setMessages] = useState(conversation?.messages ?? []);
    const [inputText, setInputText] = useState('');

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

    const handleSend = () => {
        const text = inputText.trim();
        if (!text) return;
        const newMsg = {
            id: String(Date.now()),
            sender: 'me' as const,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            text,
        };
        setMessages((prev) => [...prev, newMsg]);
        setInputText('');
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const shouldShowTime = (index: number) => {
        if (index === 0) return true;
        return messages[index].time !== messages[index - 1].time;
    };

    if (!conversation) return null;

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
                <Image source={conversation.image} style={styles.headerAvatar} contentFit="cover" />
                <Body6 color={Colors.PRIMARY_TEXT}>{conversation.name}</Body6>
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
                        <View>
                            {shouldShowTime(index) && (
                                <Caption3
                                    color={Colors.TEXT_COLOR}
                                    align="center"
                                    style={styles.timeLabel}
                                >
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
                    )}
                />

                {/* ── Input bar ── */}
                <View style={[styles.inputBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : hp(12) }]}>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type Something . . ."
                            placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                            multiline
                        />
                        <Pressable onPress={() => {}} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
        </SafeAreaView>
    );
}

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