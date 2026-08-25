import { DownArrowIcon } from '@/assets/icons/common_icon/DownArrowIcon';
import { Body6, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

interface Props {
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
}

export function FormDropdown({ label, value, options, onChange }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.wrapper}>
            <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                {label}
            </Body6>

            {/* Trigger */}
            <Pressable style={styles.box} onPress={() => setOpen(true)}>
                <Caption3
                    color={value ? Colors.TEXT_COLOR : Colors.TEXT_COLOR}
                    style={{ flex: 1 }}
                >
                    {value || label}
                </Caption3>
                <Caption3 color={Colors.TEXT_COLOR}><DownArrowIcon color={Colors.TEXT_COLOR}/></Caption3>
            </Pressable>

            {/* Modal dropdown */}
            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
                    <View style={styles.sheet}>
                        <Caption3
                            color={Colors.TEXT_COLOR}
                            style={styles.sheetLabel}
                        >
                            {label}
                        </Caption3>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.option,
                                        item === value && styles.optionSelected,
                                    ]}
                                    onPress={() => {
                                        onChange(item);
                                        setOpen(false);
                                    }}
                                >
                                    <Caption3
                                        color={
                                            item === value
                                                ? Colors.COLOR_ACTIVE
                                                : Colors.PRIMARY_TEXT
                                        }
                                    >
                                        {item}
                                    </Caption3>
                                    {item === value && (
                                        <Caption3 color={Colors.COLOR_ACTIVE}>✓</Caption3>
                                    )}
                                </Pressable>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={styles.separator} />
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginBottom: hp(20) },
    label: { marginBottom: hp(8), fontFamily: 'Poppins_500Medium' },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
    },
    // Modal
    overlay: {
        flex: 1,
        backgroundColor: '#00000040',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: wp(20),
        borderTopRightRadius: wp(20),
        paddingTop: hp(16),
        paddingBottom: hp(40),
        maxHeight: '60%',
    },
    sheetLabel: {
        paddingHorizontal: wp(20),
        paddingBottom: hp(12),
        fontFamily: 'Poppins_500Medium',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: hp(4),
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(20),
        paddingVertical: hp(14),
    },
    optionSelected: {
        backgroundColor: '#F0F9FF',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: wp(20),
    },
});