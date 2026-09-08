
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path, Rect } from "react-native-svg";


export const RevenueIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <Rect width="30" height="30" rx="15" fill="white" />
            <Path d="M16.6667 20.0001C20.3486 20.0001 23.3333 17.0153 23.3333 13.3334C23.3333 9.65151 20.3486 6.66675 16.6667 6.66675C12.9848 6.66675 10 9.65151 10 13.3334C10 17.0153 12.9848 20.0001 16.6667 20.0001Z" stroke="black" strokeLinecap="round" />
            <Path d="M7.6305 14.1667C7.02105 15.0981 6.66669 16.2113 6.66669 17.4074C6.66669 20.6802 9.31984 23.3334 12.5927 23.3334C13.7888 23.3334 14.902 22.9791 15.8334 22.3696" stroke="black" strokeLinecap="round" />
            <Path d="M19.1667 15.4103C18.768 16.1631 18.0427 16.6667 17.214 16.6667C15.9559 16.6667 14.9359 15.5059 14.9359 14.0741V12.5926C14.9359 11.1607 15.9559 10 17.214 10C18.0427 10 18.768 10.5036 19.1667 11.2565M14.1667 13.3333H17.4359" stroke="black" strokeLinecap="round" />
        </Svg>


    );
};


