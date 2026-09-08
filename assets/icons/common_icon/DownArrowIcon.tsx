
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const DownArrowIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
            <Path d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04995 8.22168L11.9997 13.1714Z" fill={color} />
        </Svg>

    );
};


