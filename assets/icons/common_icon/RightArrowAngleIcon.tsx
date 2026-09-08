
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const RightarrowAngleIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="18" height="18" viewBox="0 0 16 16" fill="none" >
            <Path d="M9.99967 12.6667L5.33301 8.00004L9.99967 3.33337" stroke="#4B5563" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


