
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const HousingIcon = ({
    size = 24,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" >
            <Path d="M22.875 9.93388L12.8457 1.2397C12.574 1.00417 12.2302 0.875 11.875 0.875C11.5198 0.875 11.176 1.00417 10.9043 1.2397L0.875 9.93388" stroke={color}  strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M21.5827 9.93359V16.9434C21.5827 19.473 21.5827 20.7378 20.8748 21.6091C20.6926 21.8334 20.48 22.0342 20.2425 22.2063C19.3199 22.8748 17.9808 22.8748 15.3024 22.8748V18.0219C15.3024 16.4967 15.3024 15.7342 14.8008 15.2603C14.299 14.7866 13.4916 14.7866 11.8768 14.7866C10.262 14.7866 9.45451 14.7866 8.95284 15.2603C8.45118 15.7342 8.45118 16.4967 8.45118 18.0219V22.8748C5.77283 22.8748 4.43367 22.8748 3.51113 22.2063C3.27362 22.0342 3.06103 21.8334 2.87879 21.6091C2.1709 20.7378 2.1709 19.473 2.1709 16.9434V9.93359" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


