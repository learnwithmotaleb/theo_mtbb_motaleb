
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const LanguageIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
            <Path d="M10.0003 18.3337C14.6027 18.3337 18.3337 14.6027 18.3337 10.0003C18.3337 5.39795 14.6027 1.66699 10.0003 1.66699C5.39795 1.66699 1.66699 5.39795 1.66699 10.0003C1.66699 14.6027 5.39795 18.3337 10.0003 18.3337Z" stroke="black" />
            <Path d="M6.66699 10.0003C6.66699 15.0003 10.0003 18.3337 10.0003 18.3337C10.0003 18.3337 13.3337 15.0003 13.3337 10.0003C13.3337 5.00033 10.0003 1.66699 10.0003 1.66699C10.0003 1.66699 6.66699 5.00033 6.66699 10.0003Z" stroke="black" strokeLinejoin="round" />
            <Path d="M17.5 12.5H2.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M17.5 7.5H2.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};


