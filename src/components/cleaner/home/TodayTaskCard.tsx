import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { Caption1, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { CleanerTask } from '@/types/taskStatus';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Props = {
    item: CleanerTask;
    onPress: (item: CleanerTask) => void;
};

export function TodayTaskCard({ item, onPress }: Props) {
    return (
        <Pressable style={styles.card} onPress={() => onPress(item)}>
            <Image source={item.image} style={styles.thumb} contentFit="cover" />
            <View style={styles.info}>
                <Caption1 color={Colors.PRIMARY_TEXT} numberOfLines={2}>
                    {item.apartmentName}
                </Caption1>
                <View style={styles.row}>
                    <LocationIcon size={15} color={Colors.TEXT_COLOR} />
                    <Caption4 color={Colors.TEXT_COLOR} numberOfLines={1}>
                        {item.address}
                    </Caption4>
                </View>
                <View style={styles.row}>
                    <CalendarIcon size={15} color={Colors.TEXT_COLOR} />
                    <Caption4 color={Colors.TEXT_COLOR}>{item.date}</Caption4>
                </View>
                <View style={styles.row}>
                    <ClockIcon size={15} color={Colors.TEXT_COLOR} />
                    <Caption4 color={Colors.TEXT_COLOR}>{item.time}</Caption4>
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
        borderRadius: wp(12),
        padding: wp(12),
        gap: wp(10),
        marginBottom: hp(10),
    },
    thumb: {
        width: wp(90),
        height: hp(110),
        borderRadius: wp(8),
    },
    info: { flex: 1, gap: hp(3) },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
});