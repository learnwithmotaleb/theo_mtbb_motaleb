import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { Caption1, Caption4, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { Task, TaskStatus } from '@/data/hostFakeData';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Props = {
    item: Task;
    onPress: (item: Task) => void;
};

function getStatusColor(status: TaskStatus): string {
    switch (status) {
        case 'refused':        return '#FF3B30';  
        case 'completed':      return '#34C759';  
        case 'pending_accept': return '#FF9500';  
        case 'scheduled':      return '#007AFF';  
        case 'report_problem': return '#FF3B30';  
        default:               return '#727272';
    }
}

export function ToDoCard({ item, onPress }: Props) {
    const statusColor = getStatusColor(item.status);

    return (
        <Pressable style={styles.card} onPress={() => onPress(item)}>
            <Image source={item.apartmentImage} style={styles.image} contentFit="cover" />
            <View style={styles.content}>
                {/* ← status color apply */}
                <Caption1 color={statusColor}>{item.statusLabel}</Caption1>
                <Caption4 color={Colors.PRIMARY_TEXT}>{item.apartmentName}</Caption4>
                <Caption5 color={"#727272"}>{item.timeAgo}</Caption5>
                <View style={styles.cleanerRow}>
                    <Image
                        source={item.cleanerImage}
                        style={styles.avatar}
                        contentFit="cover"
                    />
                    <Caption5 color={Colors.TEXT_COLOR}>{item.cleanerName}</Caption5>
                </View>
            </View>
            <RightAngleIcon size={24} color={Colors.TEXT_COLOR} />
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
        // marginBottom:hp(20)
    },
    image: {
        width: wp(90),
        height: hp(100),
        borderRadius:wp(12)
    },
    content: { flex: 1, gap: hp(3), paddingVertical: hp(10) },
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
});