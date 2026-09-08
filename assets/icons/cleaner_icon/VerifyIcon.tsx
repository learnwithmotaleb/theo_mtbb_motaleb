
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";


export const VerifyIcon = ({
    size = 16,
    color = "#00C853",
}: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" >
            <G clipPath="url(#clip0_18_8410)">
                <Path d="M6.90909 20L5.18182 16.9524L1.90909 16.1905L2.22727 12.6667L0 10L2.22727 7.33333L1.90909 3.80952L5.18182 3.04762L6.90909 0L10 1.38095L13.0909 0L14.8182 3.04762L18.0909 3.80952L17.7727 7.33333L20 10L17.7727 12.6667L18.0909 16.1905L14.8182 16.9524L13.0909 20L10 18.619L6.90909 20ZM9.04545 13.381L14.1818 8L12.9091 6.61905L9.04545 10.6667L7.09091 8.66667L5.81818 10L9.04545 13.381Z" fill={color}/>
            </G>
            <Defs>
                <ClipPath id="clip0_18_8410">
                    <Rect width={size} height={size} fill="white" />
                </ClipPath>
            </Defs>
        </Svg>

    );
};


