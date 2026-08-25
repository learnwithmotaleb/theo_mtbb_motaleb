import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CleaningValidatedModal } from '@/components/host/task_status/CleaningValidatedModal';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body2, Body4, Caption2, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { TASK_STATUS_DATA } from '@/data/hostFakeData';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

export function ChecklistScreen() {
    const data = TASK_STATUS_DATA.completed;
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ marginTop: hp(10) }}>
                    <Body4 color={Colors.PRIMARY_TEXT}>Checklist Header</Body4>
                    <Caption3 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(16) }}>
                        Cleaning completed on Thursday, June 12 at 10:00 AM
                    </Caption3>
                </View>

                {/* Apartment card */}
                <View style={styles.apartmentCard}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image source={data.apartmentImage} style={styles.thumb} contentFit="cover" />
                        <View style={styles.apartmentInfo}>
                            <Caption2 color={Colors.PRIMARY_TEXT} numberOfLines={1}>
                                {data.apartmentName}
                            </Caption2>
                            <View style={styles.infoRow}>
                                <View style={{ marginTop: hp(5) }}>
                                    <CalendarIcon size={18} color={Colors.TEXT_COLOR} />
                                </View>

                                <View>
                                    <Caption3 color={Colors.TEXT_COLOR}>Date:</Caption3>
                                    <Caption4 color={Colors.PRIMARY_TEXT}>{data.date}</Caption4>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <ClockIcon size={13} color={Colors.TEXT_COLOR} />
                                <View>
                                    <Caption3 color={Colors.TEXT_COLOR}>Time:</Caption3>
                                    <Caption4 color={Colors.PRIMARY_TEXT}>{data.time}</Caption4>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Cleaner row */}
                    <View style={styles.cleanerRow}>
                        <Image source={data.cleanerImage} style={styles.cleanerAvatar} contentFit="cover" />
                        <View style={{ flex: 1 }}>
                            <Body4 color={Colors.PRIMARY_TEXT}>{data.cleanerName}</Body4>
                            <Caption3 color={Colors.TEXT_COLOR}>Assigned Cleaner</Caption3>
                        </View>
                        <Pressable style={styles.contactBtn} onPress={() => { }}>
                            <Caption3 color={"#4352EF"}>Contact {data.cleanerName}</Caption3>
                        </Pressable>
                    </View>
                </View>



                {/* Photos */}
                <View style={styles.photoGalarry}>
                    <Caption2 color={Colors.TEXT_COLOR} align="center" style={styles.photosLabel}>
                        Photos
                    </Caption2>
                    {data.photos.map((photo, idx) => (
                        <View key={idx} style={styles.photoWrapper}>
                            <Image source={photo} style={styles.photo} contentFit="cover" />
                            <Pressable style={styles.closeBtn} onPress={() => { }}>
                                <Caption3 color={Colors.PRIMARY_TEXT}>✕</Caption3>
                            </Pressable>
                        </View>
                    ))}
                </View>

                {/* Notes */}
                <Body2 color={Colors.PRIMARY_TEXT} style={{ marginTop: hp(16), marginBottom: hp(6) }}>
                    🧹 Notes from the housekeeper
                </Body2>
                <Caption3 color={Colors.TEXT_COLOR}>{data.notes}</Caption3>
            </ScrollView>

            {/* Footer buttons */}
            <View style={styles.footer}>
                <CustomButton
                    title="Invalidated"
                    onPress={() => { }}
                    width="45%"
                    backgroundColor={Colors.BORDER_COLOR}
                    color={"#8E8E93"}
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
                <CustomButton
                    title="Validate cleaning"
                    onPress={() => setModalVisible(true)}
                    width="52%"
                    backgroundColor={Colors.COLOR_ACTIVE}
                    color="#fff"
                    borderRadius={wp(
                        8)}
                    height={hp(52)}
                />
            </View>

            {/* Modal */}
            <CleaningValidatedModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingBottom: hp(100) },
    apartmentCard: {

        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
        marginBottom: hp(12),
    },
    thumb: {
        width: wp(100),
        height: hp(120),
        borderRadius: wp(10)
    },
    apartmentInfo: {
        flex: 1,
        padding: wp(12),
        gap: hp(8)
    },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(6) },
    cleanerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        padding: wp(14),
        // backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        marginVertical: hp(10),
    },
    cleanerAvatar: { width: wp(40), height: wp(40), borderRadius: wp(20) },
    contactBtn: {
        paddingHorizontal: wp(10),
        paddingVertical: hp(6),
        borderRadius: wp(8),
        backgroundColor: "#F3F3FE"
        // borderWidth: 1,
        // borderColor: Colors.COLOR_ACTIVE,
    },
    photoGalarry:{
        backgroundColor:Colors.INPUT_BACKGROUND,
        borderRadius:wp(10),
        // padding:wp(10)
    },
    photosLabel: { 
        marginBottom: hp(12)
     },
    photoWrapper: {
         position: 'relative',
          marginBottom: hp(8) 
        },
    photo: {
         width: '100%',
          height: hp(450),
          borderRadius:wp(15)
        },
    closeBtn: {
        position: 'absolute', top: wp(8), right: wp(8),
        width: wp(28), height: wp(28), borderRadius: wp(6),
        backgroundColor: '#ffffff',
        alignItems: 'center', justifyContent: 'center',
    },
    footer: {
        // position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row',
        gap: wp(10),
        // padding: wp(20),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
});



