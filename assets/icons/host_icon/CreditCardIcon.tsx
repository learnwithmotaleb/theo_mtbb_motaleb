
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const CreditCardIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="30" height="30" viewBox="0 0 30 30" fill="none" >
            <Path d="M2.5 15C2.5 10.5782 2.5 8.36721 3.816 6.89113C4.02649 6.65504 4.25848 6.43669 4.50933 6.23859C6.07766 5 8.42677 5 13.125 5H16.875C21.5732 5 23.9224 5 25.4906 6.23859C25.7415 6.43669 25.9735 6.65504 26.184 6.89113C27.5 8.36721 27.5 10.5782 27.5 15C27.5 19.4219 27.5 21.6328 26.184 23.1089C25.9735 23.345 25.7415 23.5633 25.4906 23.7614C23.9224 25 21.5732 25 16.875 25H13.125C8.42677 25 6.07766 25 4.50933 23.7614C4.25848 23.5633 4.02649 23.345 3.816 23.1089C2.5 21.6328 2.5 19.4219 2.5 15Z" fill="#0088FF" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12.5 20H14.375" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M18.125 20H22.5" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M2.5 11.25H27.5" stroke="white" strokeLinejoin="round" />
        </Svg>

    );
};


