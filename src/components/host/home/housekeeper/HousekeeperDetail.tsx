import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { VerifyIcon } from '@/assets/icons/cleaner_icon/VerifyIcon';
import { StepIndecatorIcon } from '@/assets/icons/common_icon/StepIndecatorIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body4, Caption3, Caption5, H3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { Housekeeper } from '@/types/dataTypes';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../../utils/responsiveDevice';

type Props = {
    data: Housekeeper;
    onAddHousekeeper: () => void;
};

export function HousekeeperDetail({ data, onAddHousekeeper }: Props) {
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Image source={data.image} style={styles.avatar} contentFit="cover" />
                    <View style={styles.headerInfo}>
                        <H3 color={Colors.PRIMARY_TEXT}>{data.name}</H3>
                        <Caption3 color={Colors.TEXT_COLOR}>{data.role}</Caption3>
                        <View style={styles.locationRow}>
                            <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                            <Caption5 color={Colors.TEXT_COLOR}>{data.location}</Caption5>
                        </View>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <View style={styles.iconBG}>
                            <LocationIcon size={24} />
                        </View>
                        <Caption5 color={Colors.TEXT_COLOR} align="center">
                            Intervention zone{'\n'}({data.interventionZone})
                        </Caption5>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.iconBG}>
                           <VerifyIcon size={24} color='#8E8E93'/>
                        </View>
                        <Caption5 color={Colors.TEXT_COLOR} align="center">
                            App experience ({data.cleaningsCompleted}{'\n'}cleanings completed)
                        </Caption5>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>

                        <View style={styles.iconBG}>
                            <CalendarIcon size={24} color={Colors.TEXT_COLOR} />
                        </View>
                        <Caption5 color={Colors.TEXT_COLOR} align="center">
                            Member since ({data.memberSince})
                        </Caption5>
                    </View>
                </View>

                {/* About */}
                <Body4 color={Colors.PRIMARY_TEXT} style={styles.sectionTitle}>
                    About Léa
                </Body4>
                <Caption5 color={Colors.TEXT_COLOR}>{data.about}</Caption5>

                {/* Services */}
                <Body4 color={Colors.PRIMARY_TEXT} style={styles.sectionTitle}>
                    Services offered
                </Body4>
                {data.services.map((service, idx) => (
                    <View key={idx} style={styles.serviceRow}>
                       <StepIndecatorIcon size={22} color='#8E8E93'/>
                        <Caption3 color={Colors.TEXT_COLOR}>{service}</Caption3>
                    </View>
                ))}

                {/* Languages */}
                <Body4 color={Colors.PRIMARY_TEXT} style={styles.sectionTitle}>
                    Languages spoken
                </Body4>
                {data.languages.map((lang, idx) => (
                    <Caption3 key={idx} color={Colors.TEXT_COLOR}>{lang}</Caption3>
                ))}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <CustomButton
                    title="Add Housekeeper"
                    onPress={onAddHousekeeper}
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingBottom: hp(100) },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(16),
        marginVertical: hp(20),
    },
    avatar: {
        width: wp(80),
        height: wp(80),
        borderRadius: wp(40),
    },
    headerInfo: { flex: 1, gap: hp(4) },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: hp(16),
        // borderTopWidth: 1,
        // borderBottomWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        marginBottom: hp(20),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(8)
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: hp(6),
        paddingHorizontal: wp(4),
    },
    iconBG: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: hp(42),
        width: wp(42),
        borderRadius: wp(24),
        backgroundColor: "#B9B9B91A"
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: Colors.BORDER_COLOR,
    },
    sectionTitle: { marginTop: hp(20), marginBottom: hp(10) },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        marginBottom: hp(8),
    },
    checkCircle: {
        width: wp(20),
        height: wp(20),
        borderRadius: wp(10),
        borderWidth: 1.5,
        borderColor: Colors.COLOR_ACTIVE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        // paddingBottom: wp(10),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
});