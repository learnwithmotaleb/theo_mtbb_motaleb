
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const CleaningBroomIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="28" height="28" viewBox="0 0 22 22" fill="none" >
            <Path d="M19.2503 2.75L11.917 10.5417" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8.65859 10.1616C6.38494 11.0337 4.56747 10.8841 2.75 10.1645C3.20887 16.0701 5.96213 18.3415 9.63316 19.25C9.63316 19.25 12.3989 17.2942 12.7976 12.6568C12.8408 12.1545 12.8624 11.9035 12.758 11.6205C12.6535 11.3375 12.4485 11.1346 12.0385 10.7287C11.3642 10.0611 11.027 9.72729 10.6268 9.64369C10.2267 9.56018 9.70402 9.76066 8.65859 10.1616Z" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M4.125 15.0759C4.125 15.0759 6.41667 15.5179 8.70833 13.75" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M7.79167 6.64583C7.79167 7.27866 7.27866 7.79167 6.64583 7.79167C6.013 7.79167 5.5 7.27866 5.5 6.64583C5.5 6.013 6.013 5.5 6.64583 5.5C7.27866 5.5 7.79167 6.013 7.79167 6.64583Z" stroke="#0088FF" />
            <Path d="M10.1982 3.66667H10.0837M10.3128 3.66667C10.3128 3.79323 10.2103 3.89583 10.0837 3.89583C9.95707 3.89583 9.85449 3.79323 9.85449 3.66667C9.85449 3.5401 9.95707 3.4375 10.0837 3.4375C10.2103 3.4375 10.3128 3.5401 10.3128 3.66667Z" stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


