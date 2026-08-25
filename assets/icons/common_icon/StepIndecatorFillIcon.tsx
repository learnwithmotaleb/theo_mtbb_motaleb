
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const StepIndecatorFillIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
            <Path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM15.4571 7.45711L9 13.9142L4.79289 9.7071L6.20711 8.2929L9 11.0858L14.0429 6.04289L15.4571 7.45711Z" fill={color} />
        </Svg>

    );
};


