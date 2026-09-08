
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const MenuIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
            <Path d="M2.5 5H20.5" stroke={color}  strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M2.5 12H20.5" stroke={color}  strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M2.5 19H20.5" stroke={color}  strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};


