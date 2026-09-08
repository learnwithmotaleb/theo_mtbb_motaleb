import { Colors } from '@/constants/theme';
import React from 'react';
import { DimensionValue, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { hp, wp } from '../../../utils/responsiveDevice';
import { Caption2 } from '../typo/Typography';
import CustomLoader from './CustomLoader';

interface CustomButtonProps {
    onPress: () => void;
    title?: string;
    icon?: React.ReactNode;
    style?: ViewStyle;
    backgroundColor?: string;
    color?: string;
    width?: DimensionValue;
    height?: number;
    borderRadius?: number;
    borderColor?: string;
    disabled?: boolean;
    isLoading?: boolean;
}

export const CustomButton = ({
    onPress,
    title,
    icon,
    style,
    backgroundColor = Colors.BRAND_PRIMARY,
    color = "white",
    width = wp(120),
    height = hp(44),
    borderRadius = 100,
    borderColor,
    disabled,
    isLoading
}: CustomButtonProps) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                styles.button,
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor,
                    borderWidth: borderColor ? 1 : 0,
                    borderColor: borderColor,
                },
                style
            ]}
        >
            {icon && icon}
            {title ? (
                <Caption2 style={{  color }}>
                    {isLoading && <CustomLoader size={16} />} {title}
                </Caption2>
            ) : null}
            
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop:hp(10)
    },
});