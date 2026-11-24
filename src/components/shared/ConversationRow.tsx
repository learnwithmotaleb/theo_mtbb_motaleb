import { AppImage } from '@/components/shared/AppImage';
import { Caption1, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import type { ConversationRow as ConversationRowData } from '@/lib/mappers';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../utils/responsiveDevice';

/**
 * One inbox row, shared by the host and cleaner message tabs.
 * Unread conversations read like Instagram's inbox: bold name and preview in
 * dark text plus a small blue dot; read ones keep the grey preview.
 */
export const ConversationRow = React.memo(function ConversationRow({
    item,
    onPress,
}: {
    item: ConversationRowData;
    onPress: () => void;
}) {
    const unread = item.unreadCount > 0;
    const previewColor = unread ? Colors.PRIMARY_TEXT : Colors.TEXT_COLOR;

    return (
        <Pressable style={styles.row} onPress={onPress}>
            <AppImage source={item.image} style={styles.avatar} contentFit="cover" />
            <View style={styles.info}>
                <Caption1 color={Colors.PRIMARY_TEXT} weight={unread ? 'bold' : 'medium'} numberOfLines={1}>
                    {item.name}
                </Caption1>
                <Caption3 color={previewColor} weight={unread ? 'semiBold' : 'regular'} numberOfLines={1}>
                    {item.lastMessage}
                </Caption3>
            </View>
            <View style={styles.meta}>
                {item.time ? (
                    <Caption3 color={previewColor} weight={unread ? 'semiBold' : 'regular'}>
                        {item.time}
                    </Caption3>
                ) : null}
                {unread ? <View style={styles.dot} /> : null}
            </View>
        </Pressable>
    );
});

const DOT = wp(9);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        marginBottom: hp(6),
        paddingHorizontal: hp(10),
        gap: wp(12),
        paddingVertical: hp(12),
    },
    avatar: {
        width: wp(48),
        height: wp(48),
        borderRadius: wp(24),
        flexShrink: 0,
    },
    info: {
        flex: 1,
        gap: hp(2),
    },
    meta: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: hp(6),
        minHeight: wp(48),
    },
    dot: {
        width: DOT,
        height: DOT,
        borderRadius: DOT / 2,
        backgroundColor: Colors.BRAND_PRIMARY,
    },
});
