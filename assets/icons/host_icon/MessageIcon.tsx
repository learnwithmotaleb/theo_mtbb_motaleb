
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";


export const MessageIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
            <G clipPath="url(#clip0_615_829)">
                <Path d="M6 8H18M6 13H13.3333" stroke={color}  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M1 9.8421C1 8.99018 1.01481 8.15856 1.043 7.35559C1.1351 4.73229 1.18116 3.42063 2.24308 2.3456C3.305 1.27058 4.64727 1.21287 7.33182 1.09747C8.80469 1.03415 10.373 1 12 1C13.627 1 15.1953 1.03415 16.6682 1.09747C19.3527 1.21287 20.6951 1.27058 21.7569 2.3456C22.8188 3.42063 22.8649 4.73229 22.957 7.35559C22.9851 8.15856 23 8.99018 23 9.8421C23 10.694 22.9851 11.5256 22.957 12.3286C22.8649 14.952 22.8188 16.2636 21.7569 17.3387C20.6951 18.4136 19.3527 18.4713 16.6681 18.5867C15.8608 18.6214 15.0248 18.6474 14.1662 18.6638C13.351 18.6792 12.9434 18.6871 12.5852 18.8241C12.227 18.9612 11.9257 19.2208 11.3229 19.7401L8.92553 21.8057C8.78 21.931 8.59461 22 8.4029 22C7.95947 22 7.6 21.6388 7.6 21.1933V18.5979C7.51026 18.5942 7.42086 18.5906 7.33181 18.5867C4.64726 18.4713 3.305 18.4136 2.24308 17.3386C1.18116 16.2636 1.1351 14.952 1.043 12.3286C1.01481 11.5256 1 10.694 1 9.8421Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </G>
            <Defs>
                <ClipPath id="clip0_615_829">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
};


