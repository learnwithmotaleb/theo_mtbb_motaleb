
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const StepIndecatorIcon = ({
    size = 20,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" >
            <Path d="M2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10ZM10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM15.4571 7.45711L14.0429 6.04289L9 11.0858L6.20711 8.2929L4.79289 9.7071L9 13.9142L15.4571 7.45711Z" fill={color} />
        </Svg>

    );
};


