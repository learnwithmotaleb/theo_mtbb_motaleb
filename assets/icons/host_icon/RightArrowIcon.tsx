
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const RightArrowIcon = ({
    size = 24,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width={size} height={24} viewBox="0 0 24 24" fill="none" >
            <Path d="M5 12H19M13 18L19 12L13 6" stroke="#2B2B2B" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


