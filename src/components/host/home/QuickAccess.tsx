import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { AddUserIcon } from '@/assets/icons/host_icon/AddUserIcon';
import { Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { wp } from '../../../../utils/responsiveDevice';

type Props = {
    onSchedule: () => void;
    onAddHousekeeper: () => void;
};

export function QuickAccess({ onSchedule, onAddHousekeeper }: Props) {
    return (
        <View style={styles.row}>
            <Pressable style={styles.btn} onPress={onSchedule}>
                <CalendarIcon size={18} color={"#0088FF"} />
                <Caption4 numberOfLines={1} color={Colors.PRIMARY_TEXT}>Schedule a cleaning</Caption4>
            </Pressable>
            <Pressable style={styles.btn} onPress={onAddHousekeeper}>
                <AddUserIcon size={18} color={Colors.COLOR_ACTIVE} />
                
                <Caption4 numberOfLines={1} color={Colors.PRIMARY_TEXT}>Add a housekeeper</Caption4>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: wp(12) },
    btn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:"center",
        gap: wp(8),
        paddingVertical: wp(14),
        paddingHorizontal:wp(5),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
});