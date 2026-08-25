
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const PrivacyPolicyIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
            <Path d="M15.5907 2.91311C14.0137 2.12851 12.0841 1.66699 10 1.66699C7.91592 1.66699 5.98625 2.12851 4.4093 2.91311C3.63598 3.29788 3.24932 3.49026 2.87467 4.09514C2.5 4.70003 2.5 5.28573 2.5 6.45711V9.36458C2.5 14.1007 6.2853 16.734 8.4775 17.8618C9.08892 18.1764 9.39458 18.3337 10 18.3337C10.6054 18.3337 10.9111 18.1764 11.5224 17.8618C13.7147 16.734 17.5 14.1007 17.5 9.36458V6.45711C17.5 5.28573 17.5 4.70004 17.1253 4.09514C16.7507 3.49025 16.364 3.29788 15.5907 2.91311Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M7.5 9.58366C7.5 9.58366 8.67325 9.79358 9.16667 11.2503C9.16667 11.2503 10.4167 8.75033 12.5 7.91699" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>


    );
};


