import { Body6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

interface Props extends TextInputProps {
    label: string;
}

export function FormField({ label, ...rest }: Props) {
    return (
        <View style={styles.wrapper}>
            <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>{label}</Body6>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={Colors.TEXT_COLOR}
                    {...rest}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginBottom: hp(20) },
    label: { marginBottom: hp(8), fontFamily: 'Poppins_500Medium' },
    inputBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
    },
    input: {
        fontSize: 13,
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        padding: 0,
    },
});