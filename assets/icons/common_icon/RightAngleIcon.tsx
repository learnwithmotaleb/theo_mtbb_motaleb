
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const RightAngleIcon = ({
    size = 24,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" >
            <Path d="M10 8L14 12L10 16" stroke="black" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};


