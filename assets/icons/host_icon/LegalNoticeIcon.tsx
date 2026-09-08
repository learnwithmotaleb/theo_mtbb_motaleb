
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const LegalNoticeIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
            <Path d="M9.58301 2.91699H8.74967C5.60697 2.91699 4.03563 2.91699 3.05932 3.8933C2.08301 4.86962 2.08301 6.44096 2.08301 9.58366V11.2503C2.08301 14.393 2.08301 15.9644 3.05932 16.9407C4.03563 17.917 5.60697 17.917 8.74967 17.917H10.4163C13.559 17.917 15.1304 17.917 16.1067 16.9407C17.083 15.9644 17.083 14.393 17.083 11.2503V10.417" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M17.9163 4.99967C17.9163 6.61051 16.6105 7.91634 14.9997 7.91634C13.3888 7.91634 12.083 6.61051 12.083 4.99967C12.083 3.38884 13.3888 2.08301 14.9997 2.08301C16.6105 2.08301 17.9163 3.38884 17.9163 4.99967Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M6.25 10.417H9.58333" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M6.25 13.75H12.9167" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>


    );
};


