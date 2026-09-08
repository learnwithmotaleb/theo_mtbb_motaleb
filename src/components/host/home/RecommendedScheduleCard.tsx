import { useT } from '@/i18n';
import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { Body5, Caption1, Caption3, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { RecommendedSchedule } from '@/types/hostTypes';
import { AppImage } from '@/components/shared/AppImage';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Props = {
    data: RecommendedSchedule;
    onPress: () => void;
};

export function RecommendedScheduleCard({ data, onPress }: Props) {
    const t = useT();
    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                {/* Thumbnail */}
                <AppImage
                    source={data.apartmentImage}
                    style={styles.thumb}
                    contentFit="cover"
                />

                {/* Right content */}
                <View style={styles.rightContent}>
                    <Caption1 color={Colors.PRIMARY_TEXT} numberOfLines={1}>
                        {data.apartmentName}
                    </Caption1>

                    <Pressable style={styles.titleRow} onPress={onPress}>
                        <Caption3 color={Colors.TEXT_COLOR}>{t("Next cleaning to schedule")}</Caption3>
                        <RightAngleIcon size={22} color={Colors.TEXT_COLOR} />
                    </Pressable>

                    <View style={styles.infoRow}>
                        {/* Ideal Date chip */}
                        <View style={styles.infoChip}>
                            <CalendarIcon size={18} color={Colors.TEXT_COLOR} />
                            <View style={styles.chipText}>
                                <Caption5 color={Colors.TEXT_COLOR}>{t("Ideal Date:")}</Caption5>
                                <Caption5 color={Colors.PRIMARY_TEXT}>{data.idealDate}</Caption5>
                            </View>
                        </View>

                        {/* Time slot chip */}
                        <View style={styles.infoChip}>
                            <ClockIcon size={17} color={Colors.TEXT_COLOR} />
                            <View style={styles.chipText}>
                                <Caption5 color={Colors.TEXT_COLOR}>{t("Time slot:")}</Caption5>
                                <Caption5
                                    color={Colors.PRIMARY_TEXT}
                                    numberOfLines={2}
                                    style={{ flexShrink: 1 }} 
                                >
                                    {data.timeSlot}
                                </Caption5>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cleanerRow}>
                        <AppImage
                            source={data.cleanerImage}
                            style={styles.cleanerAvatar}
                            contentFit="cover"
                        />
                        <View>
                            <Body5 color={Colors.PRIMARY_TEXT}>{data.cleanerName}</Body5>
                            <Caption3 color={Colors.TEXT_COLOR}>{t("Assigned Cleaner")}</Caption3>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
    },
    topRow: {
        flexDirection: 'row',
    },
    thumb: {
        width: wp(110),
        height: hp(160),
        borderRadius:wp(10)
    },
    rightContent: {
        flex: 1,
        paddingHorizontal: wp(8),
        paddingVertical: hp(5),
        gap: hp(10),
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(20),
    },
    infoRow: {
        flexDirection: 'row',
        gap: wp(0),
        marginTop: hp(2),
    },
    infoChip: {
        flex: 1,                  
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(5),
        backgroundColor: "#EEEDF2",
        marginRight: wp(5),
        borderRadius: wp(5),
        overflow: 'hidden', 
    },
    chipText: {
        flex: 1,     
        flexShrink: 1,        
    minWidth: 0,               
    },
    cleanerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
    },
    cleanerAvatar: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
    },
});