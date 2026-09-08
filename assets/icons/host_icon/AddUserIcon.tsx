
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const AddUserIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="18" height="18" viewBox="0 0 21 21" fill="none" >
            <Path d="M16.4094 20.5V12.3182M12.3184 16.4091H20.5004" stroke="#00C8B3" strokeLinecap="square" />
            <Path d="M14.1359 5.95454C14.1359 2.94209 11.4902 0.5 8.22664 0.5C4.96305 0.5 2.31738 2.94209 2.31738 5.95454C2.31738 8.96698 4.96305 11.4091 8.22664 11.4091C11.4902 11.4091 14.1359 8.96698 14.1359 5.95454Z" stroke="#00C8B3" strokeLinecap="square" />
            <Path d="M0.5 19.5909C0.5 15.0722 3.86721 11.4091 8.02087 11.4091C9.61873 11.4091 11.1003 11.9512 12.3185 12.8756" stroke="#00C8B3" strokeLinecap="square" />
        </Svg>

    );
};


