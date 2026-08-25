
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const PlusIcon = ({
    size = 24,
    color = "#4B4B4B",
}: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" >
            <Path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" fill={color} />
        </Svg>

    );
};


