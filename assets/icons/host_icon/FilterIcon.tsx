
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const FilterIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" >
            <Path d="M2 4H14" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M4 8H12" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M6 12H10" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


