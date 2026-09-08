
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const ShieldCheckIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" >
            <Path d="M10.9135 2.03927C9.80962 1.49005 8.45886 1.16699 7 1.16699C5.54114 1.16699 4.19037 1.49005 3.08651 2.03927C2.54519 2.30861 2.27453 2.44328 2.01227 2.8667C1.75 3.29012 1.75 3.70011 1.75 4.52007V6.5553C1.75 9.87062 4.39971 11.7139 5.93425 12.5034C6.36224 12.7236 6.57621 12.8337 7 12.8337C7.42379 12.8337 7.63776 12.7236 8.06569 12.5034C9.60027 11.7139 12.25 9.87062 12.25 6.5553V4.52007C12.25 3.70011 12.25 3.29013 11.9877 2.8667C11.7255 2.44327 11.4548 2.30861 10.9135 2.03927Z" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M5.25 6.70866C5.25 6.70866 6.07127 6.8556 6.41667 7.87533C6.41667 7.87533 7.29167 6.12533 8.75 5.54199" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>


    );
};


