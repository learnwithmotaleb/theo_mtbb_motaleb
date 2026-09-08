
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path, Rect } from "react-native-svg";


export const ClientsIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="30" height="30" viewBox="0 0 30 30" fill="none" >
            <Rect width="30" height="30" rx="15" fill="white" />
            <Path d="M17.9166 14.1667C17.9166 12.5558 16.6108 11.25 15 11.25C13.3891 11.25 12.0833 12.5558 12.0833 14.1667C12.0833 15.7775 13.3891 17.0833 15 17.0833C16.6108 17.0833 17.9166 15.7775 17.9166 14.1667Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M17.9023 14.4583C18.1706 14.5396 18.4552 14.5833 18.75 14.5833C20.3609 14.5833 21.6667 13.2775 21.6667 11.6667C21.6667 10.0558 20.3609 8.75 18.75 8.75C17.2376 8.75 15.994 9.90117 15.8478 11.3751" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M14.1522 11.3751C14.006 9.90117 12.7624 8.75 11.25 8.75C9.63915 8.75 8.33331 10.0558 8.33331 11.6667C8.33331 13.2775 9.63915 14.5833 11.25 14.5833C11.5448 14.5833 11.8294 14.5396 12.0977 14.4583" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M23.3333 18.7499C23.3333 16.4488 21.2813 14.5833 18.75 14.5833" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M19.5834 21.2499C19.5834 18.9488 17.5314 17.0833 15 17.0833C12.4687 17.0833 10.4167 18.9488 10.4167 21.2499" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M11.25 14.5833C8.71871 14.5833 6.66669 16.4488 6.66669 18.7499" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>


    );
};


