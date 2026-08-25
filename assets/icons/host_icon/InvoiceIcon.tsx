
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const InvoiceIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="28" height="28" viewBox="0 0 22 22" fill="none" >
            <Path d="M13.75 2.29199V3.66699C13.75 4.96335 13.75 5.61154 14.1527 6.01426C14.5555 6.41699 15.2037 6.41699 16.5 6.41699H17.875" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3.66699 14.6663V7.33301C3.66699 4.74028 3.66699 3.44392 4.47245 2.63846C5.27791 1.83301 6.57426 1.83301 9.16699 1.83301H12.991C13.3656 1.83301 13.553 1.83301 13.7215 1.90278C13.8898 1.97256 14.0224 2.10504 14.2873 2.36998L17.7967 5.87937C18.0616 6.14431 18.1941 6.27679 18.2639 6.44524C18.3337 6.6137 18.3337 6.80105 18.3337 7.17574V14.6663C18.3337 17.259 18.3337 18.5554 17.5282 19.3609C16.7227 20.1663 15.4264 20.1663 12.8337 20.1663H9.16699C6.57426 20.1663 5.27791 20.1663 4.47245 19.3609C3.66699 18.5554 3.66699 17.259 3.66699 14.6663Z" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M7.33301 10.083H14.6663M7.33301 12.833H14.6663M7.33301 15.583H11.1562" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


