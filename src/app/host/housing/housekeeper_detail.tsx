import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { VerifyIcon } from '@/assets/icons/cleaner_icon/VerifyIcon';
import { StepIndecatorIcon } from '@/assets/icons/common_icon/StepIndecatorIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body6, Caption3, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { HOUSEKEEPERS } from '@/data/hostFakeData';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function HousekeeperDetailScreen() {
    const router = useRouter();
    const data = HOUSEKEEPERS[0];

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Housekeeper" />
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Image
                            source={data.image}
                            style={styles.avatar}
                            contentFit="cover"
                        />
                        <View style={styles.headerInfo}>
                            <Body1 color={Colors.PRIMARY_TEXT}>{data.name}</Body1>
                            <Caption3 color={Colors.TEXT_COLOR}>{data.role}</Caption3>
                            <View style={styles.locationRow}>
                                <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                                <Caption3 color={Colors.TEXT_COLOR}>{data.location}</Caption3>
                            </View>
                        </View>
                    </View>

                    {/* <View style={styles.divider} /> */}

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
                                <VerifyIcon size={24} color='#8E8E93' />
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

                    {/* Stats */}
                    {/* <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <LocationPinIcon size={22} color={Colors.TEXT_COLOR} />
                            <Caption4 color={Colors.TEXT_COLOR} align="center">
                                Intervention zone{'\n'}({data.interventionZone})
                            </Caption4>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <CalendarIcon size={22} color={Colors.TEXT_COLOR} />
                            <Caption4 color={Colors.TEXT_COLOR} align="center">
                                App experience ({data.cleaningsCompleted}{'\n'}cleanings completed)
                            </Caption4>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <CalendarIcon size={22} color={Colors.TEXT_COLOR} />
                            <Caption4 color={Colors.TEXT_COLOR} align="center">
                                Member since ({data.memberSince})
                            </Caption4>
                        </View>
                    </View>

                    <View style={styles.divider} /> */}

                    {/* About */}
                    <View style={styles.section}>
                        <Body6 color={Colors.PRIMARY_TEXT} style={styles.sectionTitle}>
                            About Léa
                        </Body6>
                        <Caption5 color={Colors.TEXT_COLOR}>{data.about}</Caption5>
                    </View>



                    {/* Services */}
                    <View style={styles.section}>
                        <Body6 color={Colors.PRIMARY_TEXT} style={styles.sectionTitle}>
                            Services offered
                        </Body6>
                        {data.services.map((service, idx) => (
                            <View key={idx} style={styles.serviceRow}>
                                <StepIndecatorIcon size={22} color='#8E8E93' />
                                <Caption3 color={Colors.TEXT_COLOR}>{service}</Caption3>
                            </View>
                        ))}
                    </View>

                    {/* <View style={styles.divider} /> */}

                    {/* Languages */}
                    <View style={styles.section}>
                        <Body6 color={Colors.PRIMARY_TEXT} style={styles.sectionTitle}>
                            Languages spoken
                        </Body6>
                        {data.languages.map((lang, idx) => (
                            <Caption3 key={idx} color={Colors.TEXT_COLOR}>{lang}</Caption3>
                        ))}
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <CustomButton
                        title="Add Housekeeper"
                        onPress={() => router.back()}
                        width="100%"
                        backgroundColor={Colors.PRIMARY_TEXT}
                        color="#fff"
                        borderRadius={wp(8)}
                        height={hp(52)}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    container: { flex: 1 },
    scroll: { paddingBottom: hp(10) },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(16),
        paddingVertical: hp(20),
    },
    avatar: { width: wp(80), height: wp(80), borderRadius: wp(40) },
    headerInfo: { flex: 1, gap: hp(3) },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },

    // Stats
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

    // Sections
    section: {
        marginBottom: hp(15),
        gap: hp(10),
        backgroundColor:Colors.INPUT_BACKGROUND,
        borderRadius:wp(10),
        padding:hp(10)
    },
    sectionTitle: { fontFamily: 'Poppins_600SemiBold' },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },

    // Services
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
    },
  

    // Footer
    footer: {
        // padding: wp(20),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
});