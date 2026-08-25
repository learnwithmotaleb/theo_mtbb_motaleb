import { Colors } from '@/constants/theme';
import { AuthHeadingProps } from '@/types/iconTypes';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../utils/responsiveDevice';
import { Body6, H1 } from '../typo/Typography';

export const AuthHeading: React.FC<AuthHeadingProps> = ({
    title,
    description,
    style,
    titleColor = Colors.PRIMARY_TEXT,
    descriptionColor = "#717171",
    imageSource,
}) => {
    return (
        <View style={[styles.container, style]}>
            {imageSource && (
                <Image
                    source={imageSource}
                    style={styles.headingImage}
                    contentFit="contain"
                />
            )}

            <H1 color="#1A1A1A" align="center">
                {title}
            </H1>

            <Body6
                // italic
                style={styles.description}
                color={descriptionColor}
                align="center"
            >
                {description}
            </Body6>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: hp(24),
    },
    headingImage: {
        height: hp(70),
        width: wp(70),
        marginBottom: hp(12),
    },
    description: {
        marginTop: hp(6),
        paddingHorizontal: wp(20),
    },
});