
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Line } from "react-native-svg";


export const MinusIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="14" height="2" viewBox="0 0 14 2" fill="none" >
            <Line y1="1" x2="14" y2="1" stroke="#4B4B4B" strokeWidth="2" />
        </Svg>


    );
};


