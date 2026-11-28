import { AppImage } from '@/components/shared/AppImage';
import { Caption1, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import type { ChatBubble } from '@/hooks/useChat';
import { useT } from '@/i18n';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsiveDevice';

type Props = {
    item: ChatBubble;
    showTime: boolean;
    /** The time divider colour differs slightly between the two chat screens. */
    timeColor?: string;
};

/**
 * One chat message: text, a photo (tap to view it full screen) or a document
 * (tap to open it). Photos used to render as an empty bubble because only the
 * text was drawn, and a photo message has no text.
 */
export const ChatMessageBubble = React.memo(function ChatMessageBubble({
    item,
    showTime,
    timeColor = Colors.TEXT_COLOR,
}: Props) {
    const t = useT();
    const insets = useSafeAreaInsets();
    const [viewerOpen, setViewerOpen] = useState(false);
    const mine = item.sender === 'me';
    const textColor = mine ? Colors.TEXT_WHITE : Colors.PRIMARY_TEXT;

    const isImage = item.messageType === 'image' && !!item.fileUrl;
    const isFile = !isImage && item.messageType !== 'text' && !!item.fileUrl;

    return (
        <View>
            {showTime && (
                <Caption3 color={timeColor} align="center" style={styles.timeLabel}>
                    — {item.time} —
                </Caption3>
            )}
            <View style={[styles.row, mine ? styles.rowMe : styles.rowOther]}>
                {isImage ? (
                    <Pressable
                        onPress={() => setViewerOpen(true)}
                        accessibilityRole="imagebutton"
                        accessibilityLabel={t('Photo')}
                        style={[styles.photoWrap, mine ? styles.photoMe : styles.photoOther]}
                    >
                        <AppImage
                            source={{ uri: item.fileUrl }}
                            style={styles.photo}
                            contentFit="cover"
                        />
                        {item.text ? (
                            <Caption1 color={textColor} style={styles.photoCaption}>
                                {item.text}
                            </Caption1>
                        ) : null}
                    </Pressable>
                ) : isFile ? (
                    <Pressable
                        onPress={() => WebBrowser.openBrowserAsync(item.fileUrl)}
                        accessibilityRole="link"
                        style={[styles.bubble, mine ? styles.bubbleMe : styles.bubbleOther]}
                    >
                        <Caption1 color={textColor} style={styles.fileName} numberOfLines={2}>
                            📎 {item.fileName || t('Document')}
                        </Caption1>
                        {item.text ? <Caption1 color={textColor}>{item.text}</Caption1> : null}
                    </Pressable>
                ) : (
                    <View style={[styles.bubble, mine ? styles.bubbleMe : styles.bubbleOther]}>
                        <Caption1 color={textColor}>{item.text}</Caption1>
                    </View>
                )}
            </View>

            {/* Full-screen photo viewer */}
            {isImage && (
                <Modal
                    visible={viewerOpen}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setViewerOpen(false)}
                >
                    <Pressable style={styles.viewer} onPress={() => setViewerOpen(false)}>
                        <AppImage
                            source={{ uri: item.fileUrl }}
                            style={styles.viewerImage}
                            contentFit="contain"
                        />
                        <Pressable
                            onPress={() => setViewerOpen(false)}
                            hitSlop={12}
                            style={[styles.viewerClose, { top: insets.top + hp(10) }]}
                            accessibilityRole="button"
                            accessibilityLabel={t('Close')}
                        >
                            <Caption1 color={Colors.TEXT_WHITE}>✕</Caption1>
                        </Pressable>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    timeLabel: { marginVertical: hp(12) },
    row: { flexDirection: 'row', marginBottom: hp(8) },
    rowMe: { justifyContent: 'flex-end' },
    rowOther: { justifyContent: 'flex-start' },
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
    photoWrap: {
        width: wp(220),
        borderRadius: wp(16),
        overflow: 'hidden',
    },
    photoMe: { backgroundColor: '#636363', borderBottomRightRadius: wp(2) },
    photoOther: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderTopLeftRadius: wp(4),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    photo: { width: '100%', height: wp(260) },
    photoCaption: { paddingHorizontal: wp(12), paddingVertical: hp(8) },
    fileName: { textDecorationLine: 'underline' },
    viewer: {
        flex: 1,
        backgroundColor: '#000000F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewerImage: { width: '100%', height: '80%' },
    viewerClose: {
        position: 'absolute',
        right: wp(20),
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        backgroundColor: '#FFFFFF33',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
