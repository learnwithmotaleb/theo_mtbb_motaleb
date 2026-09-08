import { LeftArrowIcon } from "@/assets/icons/common_icon/LeftArrowIcon";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { hp, wp } from "../../../utils/responsiveDevice";
import { Body2 } from "../typo/Typography";

interface SectionTitleProps {
    title?: string;
    containerStyle?: StyleProp<ViewStyle>;
    showBackButton?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
    title,
    containerStyle,
    showBackButton = true,
}) => {
    const router = useRouter();

    return (
        <View style={[styles.headerRow, containerStyle]}>
            {/* Left slot */}
            <View style={styles.sideSlot}>
                {showBackButton && (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backIconContainer}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <LeftArrowIcon />
                    </TouchableOpacity>
                )}
            </View>

            {/* Center title */}
            <Body2 color={Colors.PRIMARY_TEXT} style={styles.headerTitle}>
                {title}
            </Body2>

            {/* Right spacer — keeps title centered */}
            <View style={styles.sideSlot} />
        </View>
    );
};

export default SectionTitle;

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: hp(10),
        // paddingTop: hp(20),
        marginTop:hp(30)
    },
    sideSlot: {
        width: wp(40),
    },
    backIconContainer: {},
    headerTitle: {
        flex: 1,
        textAlign: "center",
    },
});