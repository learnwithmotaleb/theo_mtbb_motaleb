import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body4, Caption3, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { TASK_STATUS_DATA } from '@/data/hostFakeData';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

export function AlertScreen() {
    const router = useRouter();
    const data = TASK_STATUS_DATA.report_problem;

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ marginTop: hp(12) }}>
                    <Body4 color={Colors.PRIMARY_TEXT}>Problem reported by {data.cleanerName}</Body4>
                    <Caption3 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(16) }}>
                        Reported on {data.reportedAt}
                    </Caption3>
                </View>

                {/* Cleaner row */}
                <View style={styles.cleanerRow}>
                    <Image source={data.cleanerImage} style={styles.cleanerAvatar} contentFit="cover" />
                    <View style={{ flex: 1 }}>
                        <Body4 color={Colors.PRIMARY_TEXT}>{data.cleanerName}</Body4>
                        <View style={styles.locationRow}>
                            <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{data.cleanerLocation}</Caption3>
                        </View>
                    </View>
                    <Pressable style={styles.messageBtn}
                        onPress={() => router.push("/host/(tabs)/message")}

                    >
                        <Caption5 color={Colors.TEXT_COLOR}>Message</Caption5>
                    </Pressable>
                </View>

                {/* Message */}
                <View style={styles.messageBox}>
                    <Caption3 color={Colors.PRIMARY_TEXT}>{data.message}</Caption3>
                </View>

                {/* Photos */}
                <Body4 color={Colors.PRIMARY_TEXT} style={styles.sectionTitle}>
                    Photos added by {data.cleanerName}
                </Body4>
                <View style={styles.photosRow}>
                    {data.photos.map((photo, idx) => (
                        <Image key={idx} source={photo} style={styles.photo} contentFit="cover" />
                    ))}
                </View>

                {/* Cleaning details */}
                <Body4 color={Colors.PRIMARY_TEXT} style={styles.sectionTitle}>
                    Cleaning Details
                </Body4>
                <View style={styles.detailsCard}>
                    <Caption3 color={Colors.TEXT_COLOR}>Ligament</Caption3>
                    <Body4 color={Colors.PRIMARY_TEXT} style={{ marginBottom: hp(12) }}>
                        {data.ligament}
                    </Body4>
                    <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(12) }}>
                        Date and House
                    </Caption3>
                    <Body4 color={Colors.PRIMARY_TEXT}>{data.dateAndHouse}</Body4>
                </View>
            </ScrollView>


            <View style={styles.footer}>
                <View style={{ marginVertical: hp(20) }}>
                    <CustomButton
                        title="Ok"
                        onPress={() => router.replace('/host/(tabs)' as any)}
                        width="100%"
                        backgroundColor={Colors.PRIMARY_TEXT}
                        color="#fff"
                        borderRadius={wp(8)}
                        height={hp(52)}
                    />
                </View>
                <Caption3 color={Colors.TEXT_COLOR} align="center" style={{ paddingBottom: hp(0) }}>
                    This alert will be removed from the home screen.
                </Caption3>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    scroll: {
        paddingBottom: hp(140),
    },
    cleanerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        marginBottom: hp(12),
        backgroundColor: Colors.INPUT_BACKGROUND,
        padding: wp(10),
        borderRadius: wp(8),
    },
    cleanerAvatar: { width: wp(44), height: wp(44), borderRadius: wp(22) },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    messageBtn: {
        paddingHorizontal: wp(14),
        paddingVertical: hp(8),
        borderRadius: wp(8),
        backgroundColor: '#F4F4F5',
    },
    messageBox: {
        backgroundColor: '#F5F4FA',
        borderRadius: wp(12),
        padding: wp(14),
        marginBottom: hp(16),
    },
    sectionTitle: { marginBottom: hp(10) },
    photosRow: { flexDirection: 'row', gap: wp(8), marginBottom: hp(16) },
    photo: { flex: 1, height: hp(160), borderRadius: wp(10) },
    detailsCard: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(14),
    },

    footer: {
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(0),
    },
});