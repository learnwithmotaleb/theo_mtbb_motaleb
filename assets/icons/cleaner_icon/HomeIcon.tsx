
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";


export const HomeIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
            <G clip-Path="url(#clip0_615_2504)">
                <Path d="M3.99998 0H6.99998C9.20911 0 11 1.79086 11 3.99998V6.99998C11 9.20911 9.20911 11 6.99998 11H3.99998C1.79086 11 0 9.20916 0 6.99998V3.99998C0 1.79086 1.79086 0 3.99998 0Z" fill={color} />
                <Path d="M17 0H20C22.2092 0 24 1.79086 24 3.99998V6.99998C24 9.20911 22.2092 11 20 11H17C14.7909 11 13.0001 9.20911 13.0001 6.99998V3.99998C13 1.79086 14.7909 0 17 0Z" fill={color} />
                <Path d="M3.99998 13H6.99998C9.20911 13 11 14.7909 11 17V20C11 22.2091 9.20911 24 6.99998 24H3.99998C1.79086 24 0 22.2092 0 20V17C0 14.7909 1.79086 13 3.99998 13Z" fill={color} />
                <Path d="M17 13H20C22.2092 13 24 14.7909 24 17V20C24 22.2092 22.2092 24 20 24H17C14.7909 24 13.0001 22.2092 13.0001 20V17C13 14.7909 14.7909 13 17 13Z" fill={color} />
            </G>
            <Defs>
                <ClipPath id="clip0_615_2504">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>

    );
};


