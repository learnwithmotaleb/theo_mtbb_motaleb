import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

/** Shown by AppImage when a picture is missing or fails to load. */
export const ImagePlaceholderIcon = ({
    size = 22,
    color = "#8E8E93",
}: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Z"
                stroke={color}
                strokeWidth={1.6}
            />
            <Circle cx="8.75" cy="8.75" r="1.75" fill={color} />
            <Path
                d="m4 16.5 4.2-4.2a1.5 1.5 0 0 1 2.1 0l3.2 3.2m0 0 1.7-1.7a1.5 1.5 0 0 1 2.1 0L20 16"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
