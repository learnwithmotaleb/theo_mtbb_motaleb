
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const FastCleaningIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <Path d="M17.4997 2.5L10.833 9.58333" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M7.87144 9.23783C5.80449 10.0307 4.15224 9.89466 2.5 9.24041C2.91716 14.6092 5.42012 16.6741 8.75742 17.5C8.75742 17.5 11.2718 15.722 11.6342 11.5062C11.6734 11.0496 11.6931 10.8213 11.5982 10.5641C11.5032 10.3068 11.3168 10.1223 10.9441 9.75333C10.3311 9.14641 10.0246 8.84299 9.66075 8.76699C9.297 8.69108 8.82183 8.87333 7.87144 9.23783Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3.75 13.7053C3.75 13.7053 5.83333 14.1072 7.91667 12.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M7.08333 6.04167C7.08333 6.61697 6.61697 7.08333 6.04167 7.08333C5.46637 7.08333 5 6.61697 5 6.04167C5 5.46637 5.46637 5 6.04167 5C6.61697 5 7.08333 5.46637 7.08333 6.04167Z" stroke="black" />
            <Path d="M9.27051 3.33333H9.16634M9.37467 3.33333C9.37467 3.44839 9.28142 3.54167 9.16634 3.54167C9.05126 3.54167 8.95801 3.44839 8.95801 3.33333C8.95801 3.21828 9.05126 3.125 9.16634 3.125C9.28142 3.125 9.37467 3.21828 9.37467 3.33333Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>


    );
};


