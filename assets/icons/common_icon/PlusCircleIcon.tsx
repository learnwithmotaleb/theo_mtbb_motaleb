
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const PlusCircleIcon = ({
    size = 20,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" >
            <Path d="M6 10H10M10 10H14M10 10V14M10 10V6M10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19Z" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>


    );
};


