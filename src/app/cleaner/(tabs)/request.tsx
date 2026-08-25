import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body4, Caption2, Caption3, Caption4, Caption5, H3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import {
    CLEANING_REQUESTS,

    CONNECTION_REQUESTS,
} from '@/data/cleanerFakeData';
import { CleaningRequest, ConnectionRequest } from '@/types/taskStatus';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

// ── Cleaning Request Card ─────────────────────────────────────────────────────
function CleaningRequestCard({
    item,
    onAccept,
    onRefuse,
    onPress,
}: {
    item: CleaningRequest;
    onAccept: () => void;
    onRefuse: () => void;
    onPress: () => void;
}) {
    return (
        <Pressable style={styles.cleaningCard} onPress={onPress}>
            <View style={styles.cardTop}>
                <Image source={item.image} style={styles.cardThumb} contentFit="cover" />
                <View style={styles.cardInfo}>
                    <Caption2 color={Colors.TEXT_COLOR} numberOfLines={2}>
                        {item.apartmentName}
                    </Caption2>
                    <View style={styles.row}>
                        <LocationIcon size={13} color={Colors.TEXT_COLOR} />
                        <Caption4 color={Colors.TEXT_COLOR}>{item.address}</Caption4>
                    </View>
                    <View style={styles.priceBadge}>
                        <Caption4 color={Colors.TEXT_COLOR}>Price per cleaning</Caption4>
                        <Caption3 color={Colors.PRIMARY_TEXT}>{item.pricePerCleaning}</Caption3>
                    </View>
                    <Caption5 color={Colors.TEXT_COLOR}>{item.description}</Caption5>
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.actionRow}>
                {/* <Pressable style={styles.refuseBtn} onPress={onRefuse}>
                    <Caption3 color={Colors.COLOR_DANGER}>Refuse</Caption3>
                </Pressable>
                <Pressable style={styles.acceptBtn} onPress={onAccept}>
                    <Caption3 color="#fff">Accept</Caption3>
                </Pressable> */}
                <CustomButton
                    title='Refuse'
                    color='#FF383C'
                    onPress={onRefuse}
                    borderRadius={wp(5)}
                    borderColor='#FF383C1A'
                    backgroundColor={Colors.APP_BACKGROUND}
                    width="49%"
                />
                <CustomButton
                    title='Accept'
                    color='#FFFFFF'
                    onPress={onAccept}
                    borderRadius={wp(5)}
                    borderColor='#FF383C1A'
                    backgroundColor={"#000000"}
                    width="49%"
                />
            </View>
        </Pressable>
    );
}

// ── Connection Request Row ────────────────────────────────────────────────────
function ConnectionRequestRow({
    item,
    onView,
}: {
    item: ConnectionRequest;
    onView: () => void;
}) {
    return (
        <View style={styles.connectionRow}>
            <Image source={item.image} style={styles.connectionAvatar} contentFit="cover" />
            <View style={{ flex: 1 }}>
                <Body4 color={Colors.PRIMARY_TEXT}>{item.name}</Body4>
                <Caption3 color={Colors.TEXT_COLOR}>{item.propertiesCount} Properties</Caption3>
            </View>
            <Pressable style={styles.viewBtn} onPress={onView}>
                <Caption3 color={Colors.TEXT_COLOR}>View</Caption3>
            </Pressable>
        </View>
    );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function RequestsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={{ marginTop: hp(20),paddingHorizontal:wp(20) }}>
                <H3 color={Colors.PRIMARY_TEXT} style={styles.pageTitle}>
                    Requests
                </H3>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.pageSubtitle}>
                    Hosts want to add your for regular cleaning
                </Caption3>
            </View>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >


                {/* Cleaning Requests */}
                <Body4 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
                    Cleaning Requests
                </Body4>
                {CLEANING_REQUESTS.map((item) => (
                    <CleaningRequestCard
                        key={item.id}
                        item={item}
                        onPress={() =>
                            router.push({
                                pathname: '/cleaner/requests/team_detail',
                                params: { requestId: item.id },
                            } as any)
                        }
                        onAccept={() => { }}
                        onRefuse={() => { }}
                    />
                ))}

                {/* Connection Requests */}
                <Body4 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
                    Connection Requests
                </Body4>
                <View style={styles.connectionList}>
                    {CONNECTION_REQUESTS.map((item, idx) => (
                        <React.Fragment key={item.id}>
                            <ConnectionRequestRow
                                item={item}
                                onView={() =>
                                    router.push({
                                        pathname: '/cleaner/requests/host_profile',
                                        params: { hostId: item.id },
                                    } as any)
                                }
                            />
                            {/* {idx < CONNECTION_REQUESTS.length - 1 && (
                                <View style={styles.divider} />
                            )} */}
                        </React.Fragment>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    scroll: { paddingHorizontal: wp(20), paddingBottom: hp(100) },
    pageTitle: { marginTop: hp(8), marginBottom: hp(4) },
    pageSubtitle: { marginBottom: hp(20) },
    sectionTitle: { marginBottom: hp(12), marginTop: hp(8) },

    // Cleaning card
    cleaningCard: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        marginBottom: hp(16),
        overflow: 'hidden',
    },
    cardTop: {
        flexDirection: 'row',
        gap: wp(12),
        padding: wp(12),
    },
    cardThumb: {
        width: wp(110),
        height: hp(120),
        borderRadius: wp(8),
    },
    cardInfo: { flex: 1, gap: hp(6) },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    priceBadge: {
        backgroundColor: Colors.APP_BACKGROUND,
        borderRadius: wp(8),
        paddingHorizontal: wp(10),
        paddingVertical: hp(3),
        gap: hp(2),
    },
    actionRow: {
        flexDirection: 'row',
        // borderTopWidth: 1,
        // borderTopColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(8),
        paddingVertical: hp(10),
        gap: wp(5)
    },
    refuseBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(14),
        borderRightWidth: 1,
        borderRightColor: Colors.BORDER_COLOR,
    },
    acceptBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(14),
        backgroundColor: Colors.PRIMARY_TEXT,
    },

    // Connection list
    connectionList: {
        // backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
    },
    connectionRow: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        marginBottom: hp(10),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        padding: wp(14),
    },
    connectionAvatar: {
        width: wp(60),
        height: wp(60),
        borderRadius: wp(30),
    },
    viewBtn: {
        paddingHorizontal: wp(16),
        paddingVertical: hp(8),
        borderRadius: wp(8),
        backgroundColor: "#74748014",
    },
    // divider: { height: 1, backgroundColor: Colors.BORDER_COLOR, marginHorizontal: wp(14) },
});