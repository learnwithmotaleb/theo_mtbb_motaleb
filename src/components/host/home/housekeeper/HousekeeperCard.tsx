import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { Body4, Caption4, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { Housekeeper } from '@/types/dataTypes';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../../utils/responsiveDevice';

type Props = {
    item: Housekeeper;
    onPress: (item: Housekeeper) => void;
};

export function HousekeeperCard({ item, onPress }: Props) {
    return (
        <Pressable style={styles.card} onPress={() => onPress(item)}>
            <Image source={item.image} style={styles.avatar} contentFit="cover" />
            <View style={styles.info}>
                <Body4 color={Colors.PRIMARY_TEXT}>{item.name}</Body4>
                <View style={styles.metaRow}>
                    <LocationIcon size={18} color={Colors.TEXT_COLOR} />
                    <Caption4 color={Colors.TEXT_COLOR}>{item.location}</Caption4>
                </View>
                <View style={styles.metaRow}>
                    <CalendarIcon size={18} color={Colors.TEXT_COLOR} />
                    <Caption4 color={Colors.TEXT_COLOR}>
                        {item.cleaningsCompleted} cleanings completed
                    </Caption4>
                </View>
                <Caption5
                    color={Colors.TEXT_COLOR}
                    numberOfLines={3}
                    style={{ marginTop: hp(4) }}
                >
                    {item.about}
                </Caption5>
            </View>
            <RightAngleIcon size={28} color={Colors.TEXT_COLOR} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(12),
        paddingVertical: hp(14),
        backgroundColor:Colors.INPUT_BACKGROUND,
        marginBottom:hp(10),
        borderRadius:wp(8)
        // borderBottomWidth: 1,
        // borderBottomColor: Colors.BORDER_COLOR,
    },
    avatar: {
        width: wp(56),
        height: wp(56),
        borderRadius: wp(28),
    },
    info: { flex: 1, gap: hp(3) },
    metaRow: {
         flexDirection: 'row',
          alignItems: 'center',
           gap: wp(4) },
});