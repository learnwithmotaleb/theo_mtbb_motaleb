
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const BankIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="34" height="34" viewBox="0 0 34 34" fill="none" >
            <Path d="M17.1771 8.14591H17M17.3542 8.14591C17.3542 8.34151 17.1957 8.50008 17 8.50008C16.8044 8.50008 16.6459 8.34151 16.6459 8.14591C16.6459 7.95032 16.8044 7.79175 17 7.79175C17.1957 7.79175 17.3542 7.95032 17.3542 8.14591Z" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M7.08337 12.75V26.9167M12.75 12.75V26.9167" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M21.25 12.75V26.9167M26.9167 12.75V26.9167" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M30.2484 12.7499H3.75169C3.24452 12.7499 2.83337 12.3341 2.83337 11.8213C2.83337 11.5069 2.99061 11.2139 3.25122 11.0426L12.3676 5.05012C14.6159 3.57221 15.7402 2.83325 17 2.83325C18.2599 2.83325 19.3842 3.57221 21.6324 5.05012L30.7489 11.0426C31.0095 11.2139 31.1667 11.5069 31.1667 11.8213C31.1667 12.3341 30.7556 12.7499 30.2484 12.7499Z" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M29.8063 28.7484L28.8319 27.7466C28.4335 27.3372 28.2343 27.1324 27.9812 27.0246C27.7279 26.9167 27.4463 26.9167 26.883 26.9167H7.11712C6.55384 26.9167 6.27219 26.9167 6.01893 27.0246C5.76569 27.1324 5.56654 27.3372 5.16824 27.7466L4.1938 28.7484C3.19259 29.7776 2.69199 30.2922 2.86817 30.7294C3.04436 31.1667 3.75233 31.1667 5.16824 31.1667H28.8319C30.2477 31.1667 30.9558 31.1667 31.1319 30.7294C31.3081 30.2922 30.8074 29.7776 29.8063 28.7484Z" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};


