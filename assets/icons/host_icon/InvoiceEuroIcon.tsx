
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const InvoiceEuroIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="28" height="28" viewBox="0 0 22 22" fill="none" >
            <Path d="M1.83301 10.9997C1.83301 16.0622 5.93706 20.1663 10.9997 20.1663C16.0622 20.1663 20.1663 16.0622 20.1663 10.9997C20.1663 5.93706 16.0622 1.83301 10.9997 1.83301C7.24075 1.83301 4.01027 4.09552 2.59576 7.33301M1.83301 4.12467L2.29134 7.79134L5.95801 6.87467" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M14.6667 7.56962C14.0113 7.13088 13.223 6.875 12.375 6.875C10.0968 6.875 8.25 8.72183 8.25 11C8.25 13.2782 10.0968 15.125 12.375 15.125C13.223 15.125 14.0113 14.8692 14.6667 14.4304M6.875 9.625H11.4583M11.4583 12.375H6.875" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


