
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const CalendarIcon = ({
    size = 16,
    color = "#685B5B",
}: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" >
            <Path d="M10.6663 1.33301V3.99967M5.33301 1.33301V3.99967" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8.66667 2.6665H7.33333C4.81917 2.6665 3.5621 2.6665 2.78105 3.44755C2 4.2286 2 5.48568 2 7.99984V9.33317C2 11.8473 2 13.1044 2.78105 13.8854C3.5621 14.6665 4.81917 14.6665 7.33333 14.6665H8.66667C11.1808 14.6665 12.4379 14.6665 13.2189 13.8854C14 13.1044 14 11.8473 14 9.33317V7.99984C14 5.48568 14 4.2286 13.2189 3.44755C12.4379 2.6665 11.1808 2.6665 8.66667 2.6665Z" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M2 6.6665H14" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M6.66667 12.3335L6.66666 9.2316C6.66666 9.1038 6.5755 9.00013 6.46305 9.00013H6M9.33333 12.3322L10.3237 9.26153C10.3301 9.24173 10.3333 9.221 10.3333 9.20013C10.3333 9.08973 10.2438 9.00013 10.1333 9.00013L8.66667 9" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


