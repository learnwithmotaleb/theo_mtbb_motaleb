
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const TermsUsesIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <Path d="M12.5 2.08301V3.33301C12.5 4.51152 12.5 5.10077 12.8661 5.46689C13.2322 5.83301 13.8215 5.83301 15 5.83301H16.25" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3.33301 13.3337V6.66699C3.33301 4.30997 3.33301 3.13146 4.06524 2.39923C4.79747 1.66699 5.97598 1.66699 8.33301 1.66699H11.8093C12.1499 1.66699 12.3203 1.66699 12.4734 1.73043C12.6265 1.79386 12.747 1.91429 12.9878 2.15515L16.1782 5.3455C16.419 5.58636 16.5395 5.70679 16.6029 5.85993C16.6663 6.01308 16.6663 6.18339 16.6663 6.52402V13.3337C16.6663 15.6907 16.6663 16.8692 15.9341 17.6014C15.2018 18.3337 14.0233 18.3337 11.6663 18.3337H8.33301C5.97598 18.3337 4.79747 18.3337 4.06524 17.6014C3.33301 16.8692 3.33301 15.6907 3.33301 13.3337Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M6.66699 9.16699H13.3337M6.66699 11.667H13.3337M6.66699 14.167H10.1427" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>


    );
};


