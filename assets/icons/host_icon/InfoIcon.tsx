
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const InfoIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
            <Path d="M10.0003 18.3337C14.6027 18.3337 18.3337 14.6027 18.3337 10.0003C18.3337 5.39795 14.6027 1.66699 10.0003 1.66699C5.39795 1.66699 1.66699 5.39795 1.66699 10.0003C1.66699 14.6027 5.39795 18.3337 10.0003 18.3337Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M10 6.66699V10.0003" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M10.1045 13.1253H10.0003M10.2087 13.1253C10.2087 13.2404 10.1154 13.3337 10.0003 13.3337C9.88524 13.3337 9.79199 13.2404 9.79199 13.1253C9.79199 13.0102 9.88524 12.917 10.0003 12.917C10.1154 12.917 10.2087 13.0102 10.2087 13.1253Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


