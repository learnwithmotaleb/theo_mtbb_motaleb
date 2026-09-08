
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const MonthIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none" >
            <Path d="M0 18V10H2V14.6L14.6 2H10V0H18V8H16V3.4L3.4 16H8V18H0Z" fill="#00C853" />
        </Svg>


    );
};


