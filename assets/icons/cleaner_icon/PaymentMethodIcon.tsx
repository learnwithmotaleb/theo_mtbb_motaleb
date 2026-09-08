
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const PaymentMethodIcon = ({
    size = 16,
    color = "#35A9D6",
}: IconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
            <Path d="M10.1042 4.79183H10M10.2084 4.79183C10.2084 4.90689 10.1151 5.00016 10 5.00016C9.88494 5.00016 9.79169 4.90689 9.79169 4.79183C9.79169 4.67677 9.88494 4.5835 10 4.5835C10.1151 4.5835 10.2084 4.67677 10.2084 4.79183Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M4.16669 7.5V15.8333M7.50002 7.5V15.8333" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12.5 7.5V15.8333M15.8333 7.5V15.8333" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M17.7932 7.49984H2.20687C1.90854 7.49984 1.66669 7.25526 1.66669 6.95356C1.66669 6.76866 1.75918 6.59631 1.91248 6.49555L7.27508 2.97055C8.59761 2.10119 9.25894 1.6665 10 1.6665C10.7411 1.6665 11.4024 2.10119 12.7249 2.97055L18.0876 6.49555C18.2409 6.59631 18.3334 6.76866 18.3334 6.95356C18.3334 7.25526 18.0915 7.49984 17.7932 7.49984Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M17.5331 16.9109L16.9599 16.3217C16.7256 16.0808 16.6084 15.9603 16.4595 15.8969C16.3105 15.8335 16.1449 15.8335 15.8135 15.8335H4.18654C3.8552 15.8335 3.68952 15.8335 3.54055 15.8969C3.39158 15.9603 3.27443 16.0808 3.04014 16.3217L2.46694 16.9109C1.87799 17.5163 1.58352 17.8191 1.68715 18.0762C1.7908 18.3335 2.20725 18.3335 3.04014 18.3335H16.9599C17.7928 18.3335 18.2093 18.3335 18.3129 18.0762C18.4165 17.8191 18.122 17.5163 17.5331 16.9109Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>


    );
};


