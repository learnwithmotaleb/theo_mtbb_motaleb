
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const LeftArrowIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" >
            <Path d="M3.82843 6.77822H16V8.77822H3.82843L9.1924 14.1421L7.7782 15.5563L0 7.77822L7.7782 0L9.1924 1.41421L3.82843 6.77822Z" fill="#1A1A1A" />
        </Svg>

    );
};


