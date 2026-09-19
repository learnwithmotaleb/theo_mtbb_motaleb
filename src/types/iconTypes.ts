import { ImageSource } from 'expo-image';
import type { ColorValue } from 'react-native';

export interface IconProps {
    size?: number;
    color?: ColorValue;
}


// ─── Auth Header
export interface AuthHeadingProps {
    title: string;
    description: string;
    style?: object;
    titleColor?: string;
    descriptionColor?: string;
    imageSource?: string | number | ImageSource;
}
