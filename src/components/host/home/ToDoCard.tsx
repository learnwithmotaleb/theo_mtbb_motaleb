import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { TrashIcon } from '@/assets/icons/common_icon/TrashIcon';
import { Caption1, Caption4, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { Task, TaskStatus } from '@/types/hostTypes';
import { AppImage } from '@/components/shared/AppImage';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Props = {
    item: Task;
    onPress: (item: Task) => void;
    onDelete?: (item: Task) => void;
};

function getStatusIndicatorColor(status: TaskStatus): string {
    switch (status) {
        case 'refused':        return '#FF3B30';
        case 'completed':      return '#34C759';
        case 'pending_accept': return '#FF9500';
        case 'scheduled':      return '#007AFF';
        case 'report_problem': return '#FF3B30';
        default:               return '#8E8E93';
    }
}

export function ToDoCard({ item, onPress, onDelete }: Props) {
    const indicatorColor = getStatusIndicatorColor(item.status);

    return (
        <Pressable style={styles.card} onPress={() => onPress(item)}>
            <AppImage source={item.apartmentImage} style={styles.image} contentFit="cover" />
            <View style={styles.content}>
                {/* Title with consistent typography color and a subtle status dot */}
                <View style={styles.titleRow}>
                    <View style={[styles.statusDot, { backgroundColor: indicatorColor }]} />
                    <Caption1 color={Colors.PRIMARY_TEXT} numberOfLines={1} style={styles.titleText}>
                        {item.statusLabel}
                    </Caption1>
                </View>
                <Caption4 color={Colors.PRIMARY_TEXT}>{item.apartmentName}</Caption4>
                <Caption5 color={"#727272"}>{item.timeAgo}</Caption5>
                <View style={styles.cleanerRow}>
                    <AppImage
                        source={item.cleanerImage}
                        style={styles.avatar}
                        contentFit="cover"
                    />
                    <Caption5 color={Colors.TEXT_COLOR}>{item.cleanerName}</Caption5>
                </View>
            </View>

            <View style={styles.actions}>
                {onDelete && (
                    <Pressable
                        style={styles.deleteBtn}
                        onPress={() => onDelete(item)}
                        hitSlop={8}
                    >
                        <TrashIcon size={16} />
                    </Pressable>
                )}
                <RightAngleIcon size={24} color={Colors.TEXT_COLOR} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        gap: wp(10),
        paddingRight: wp(12),
    },
    image: {
        width: wp(90),
        height: hp(100),
        borderRadius: wp(12),
    },
    content: { flex: 1, gap: hp(3), paddingVertical: hp(10) },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(6),
    },
    statusDot: {
        width: wp(8),
        height: wp(8),
        borderRadius: wp(4),
    },
    titleText: {
        flex: 1,
    },
    cleanerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(6),
        marginTop: hp(2),
    },
    avatar: {
        width: wp(22),
        height: wp(22),
        borderRadius: wp(11),
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
    },
    deleteBtn: {
        padding: wp(6),
        alignItems: 'center',
        justifyContent: 'center',
    },
});