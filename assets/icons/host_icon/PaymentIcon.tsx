
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const PaymentIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
            <Path d="M1.66699 9.99967C1.66699 7.05177 1.66699 5.57782 2.54433 4.59376C2.68465 4.43637 2.83931 4.2908 3.00654 4.15873C4.0521 3.33301 5.61818 3.33301 8.75033 3.33301H11.2503C14.3825 3.33301 15.9486 3.33301 16.9941 4.15873C17.1613 4.2908 17.316 4.43637 17.4563 4.59376C18.3337 5.57782 18.3337 7.05177 18.3337 9.99967C18.3337 12.9476 18.3337 14.4215 17.4563 15.4056C17.316 15.563 17.1613 15.7085 16.9941 15.8406C15.9486 16.6663 14.3825 16.6663 11.2503 16.6663H8.75033C5.61818 16.6663 4.0521 16.6663 3.00654 15.8406C2.83931 15.7085 2.68465 15.563 2.54433 15.4056C1.66699 14.4215 1.66699 12.9476 1.66699 9.99967Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8.33301 13.333H9.58301" stroke="black" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12.083 13.333H14.9997" stroke="black" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M1.66699 7.5H18.3337" stroke="black" strokeLinejoin="round" />
        </Svg>
    );
};


