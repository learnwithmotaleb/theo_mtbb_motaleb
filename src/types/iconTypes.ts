import { ImageSource } from 'expo-image';

export interface IconProps {
    size?: number;
    color?: string;
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