import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { AcceptVerifyIcon } from '@/assets/icons/host_icon/AcceptVerifyIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body4, Caption2, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { TASK_STATUS_DATA } from '@/data/hostFakeData';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

export function AcceptedInvitationScreen() {
    const router = useRouter();
    const data = TASK_STATUS_DATA.pending_accept;

    return (
        <>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ marginTop: hp(50) }}>
                    <AcceptVerifyIcon />
                </View>


                <Body4 color={Colors.PRIMARY_TEXT} align="center" style={{ marginTop: hp(12) }}>
                    {data.cleanerName} has accepted your invitation!
                </Body4>
                <Caption3 color={Colors.TEXT_COLOR} align="center" style={styles.desc}>
                    She is joining your household and will be able to receive missions.
                </Caption3>

                {/* Cleaner card */}
                <View style={styles.card}>
                    <Image source={data.cleanerImage} style={styles.cleanerAvatar} contentFit="cover" />
                    <View>
                        <Body4 color={Colors.PRIMARY_TEXT}>{data.cleanerName}</Body4>
                        <Caption3 color={"#35A9D6"}>Verified</Caption3>
                        <Caption2 color={Colors.TEXT_COLOR}>Housekeeper</Caption2>
                    </View>
                </View>

                {/* Apartment card */}
                <View style={styles.apartmentCard}>
                    <Image source={data.apartmentImage} style={styles.thumb} contentFit="cover" />
                    <View style={{ flex: 1 }}>
                        <Caption2 color={Colors.PRIMARY_TEXT} numberOfLines={3}>
                            {data.apartmentName}
                        </Caption2>
                        <View style={styles.locationRow}>
                            <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{data.apartmentLocation}</Caption3>
                        </View>
                        <Caption4 color={Colors.TEXT_COLOR}>{data.apartmentCountry}</Caption4>
                    </View>
                </View>

                {/* Next step */}
                <View style={styles.nextStepBox}>
                    <Body4 color={Colors.PRIMARY_TEXT} style={{ marginBottom: hp(4) }}>
                        Next step
                    </Body4>
                    <Caption3 color={Colors.TEXT_COLOR}>
                        {data.cleanerName} will soon be able to view and accept your missions.
                    </Caption3>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <CustomButton
                    title="Return to home"
                    onPress={() => router.replace('/host/(tabs)' as any)}
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingBottom: hp(100), alignItems: 'center' },
    iconCircle: {
        width: wp(80), height: wp(80), borderRadius: wp(40),
        backgroundColor: '#BFD9F2',
        alignItems: 'center', justifyContent: 'center',
        marginTop: hp(16),
    },
    desc: { marginTop: hp(8), marginBottom: hp(24) },
    card: {
        flexDirection: 'row',
        // alignItems: 'center',
        gap: wp(12),
        width: '100%',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(14),
        marginBottom: hp(12),


        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    cleanerAvatar: { width: wp(44), height: wp(44), borderRadius: wp(22) },
    apartmentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        width: '100%',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        // borderWidth: 1, borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
        marginBottom: hp(12),
        paddingHorizontal:wp(5)
    },
    thumb: {
        width: wp(120),
        height: hp(80),
        borderRadius: wp(10)
    },
    locationRow: {
         flexDirection: 'row',
          alignItems: 'center', 
          gap: wp(4),
           marginTop: hp(4) 
        },
    nextStepBox: {
        width: '100%',
        backgroundColor: "#0909890D",
        borderRadius: wp(12),
        // borderWidth: 1,
        //  borderColor: Colors.BORDER_COLOR,
        padding: wp(14),
    },
    footer: {
        // position: 'absolute', bottom: 0, left: 0, right: 0,
        // paddingVertical: wp(20),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1, borderColor: Colors.BORDER_COLOR,
    },
});