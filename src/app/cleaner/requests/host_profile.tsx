import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { AppertmentIcon } from '@/assets/icons/cleaner_icon/AppartmentIcon';
import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Body4, Caption2, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { toCleanerRequest } from '@/lib/mappers';
import {
    useGetMyRequestsQuery,
    useRespondToAssignmentMutation,
} from '@/redux/services/assignmentApi';
import { AppImage } from '@/components/shared/AppImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function HostProfileScreen() {
    const t = useT();
    const router = useRouter();
    const { hostId } = useLocalSearchParams<{ hostId: string }>();

    // There is no public host profile endpoint for cleaners; everything this
    // screen shows already travels with the cleaner's own pending requests.
    const { data, isLoading } = useGetMyRequestsQuery({
        status: 'pending',
        page: 1,
        limit: 50,
    });
    const [respond, { isLoading: isResponding }] = useRespondToAssignmentMutation();

    const mine = useMemo(
        () =>
            (data?.data ?? [])
                .map(toCleanerRequest)
                .filter((request) => request.hostId === hostId),
        [data, hostId],
    );

    const host = useMemo(() => {
        const first = mine[0];
        const city = first?.address ?? '';
        return {
            id: hostId,
            name: first?.hostName ?? 'Host',
            image: first?.hostImage,
            role: 'Host',
            location: city,
            city,
            propertiesCount: first?.hostProperties || mine.length,
            memberSince: first?.hostMemberSince || '-',
            properties: mine.map((request) => ({
                id: request.accommodationId,
                name: request.apartmentName,
                location: request.address,
                image: request.image,
            })),
        };
    }, [mine, hostId]);

    // Accepting the connection answers every property this host is asking about.
    const respondAll = async (action: 'accept' | 'refuse') => {
        if (isResponding || mine.length === 0) return;
        try {
            for (const request of mine) {
                await respond({ assignmentId: request.id, action }).unwrap();
            }
            showToast(
                action === 'accept' ? 'Request accepted' : 'Request refused',
                'success',
            );
            router.back();
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not send your answer.")), 'error');
        }
    };

    if (isLoading && !data) {
        return (
            <SafeAreaView style={[styles.safe, { paddingTop: hp(16) }]}>
                <SkeletonDetail />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t("Host")} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <AppImage source={host.image} style={styles.avatar} contentFit="cover" />
                    <View style={styles.headerInfo}>
                        <Body4 color={Colors.PRIMARY_TEXT}>{host.name}</Body4>
                        <Caption4 color={Colors.TEXT_COLOR}>{host.role}</Caption4>
                        <View style={styles.row}>
                            <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{host.location}</Caption3>
                        </View>
                    </View>
                </View>

                {/* <View style={styles.divider} /> */}

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <LocationIcon size={28} color={Colors.TEXT_COLOR} />
                        </View>
                        <Caption4 color={Colors.TEXT_COLOR} align="center">{host.city}</Caption4>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <AppertmentIcon size={22} />
                        </View>
                        <Caption4 color={Colors.TEXT_COLOR} align="center">
                            {host.propertiesCount} Properties
                        </Caption4>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                            <CalendarIcon size={28} color={Colors.TEXT_COLOR} />
                        </View>
                        <Caption4 color={Colors.TEXT_COLOR} align="center">
                            Member since{'\n'}({host.memberSince})
                        </Caption4>
                    </View>
                </View>

                {/* <View style={styles.divider} /> */}

                {/* Properties */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        {t("PROPERTIES")}
                    </Caption2>
                    {host.properties.map((prop) => (
                        <Pressable
                            key={prop.id}
                            style={styles.propertyCard}
                            onPress={() =>
                                router.push({
                                    pathname: '/cleaner/requests/accommodation_detail',
                                    params: { accommodationId: prop.id },
                                } as any)
                            }
                        >
                            <AppImage
                                source={prop.image}
                                style={styles.propertyThumb}
                                contentFit="cover"
                            />
                            <View style={styles.propertyInfo}>
                                <Body4 color={Colors.PRIMARY_TEXT} numberOfLines={1}>
                                    {prop.name}
                                </Body4>
                                <View style={styles.row}>
                                    <LocationIcon size={12} color={Colors.TEXT_COLOR} />
                                    <Caption3 color={Colors.TEXT_COLOR}>{prop.location}</Caption3>
                                </View>
                            </View>
                            <RightAngleIcon size={28} color={Colors.TEXT_COLOR} />
                        </Pressable>
                    ))}
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <CustomButton
                    title={t("Refuse")}
                    color='#FF383C'
                    onPress={() => respondAll('refuse')}
                    borderRadius={wp(5)}
                    borderColor='#FF383C1A'
                    backgroundColor={Colors.APP_BACKGROUND}
                    width="49%"
                />
                <CustomButton
                    title={t("Accept")}
                    color='#FFFFFF'
                    onPress={() => respondAll('accept')}
                    borderRadius={wp(5)}
                    borderColor='#FF383C1A'
                    backgroundColor={"#000000"}
                    width="49%"
                />
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
    scroll: { paddingBottom: hp(20) },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(16),
        padding: wp(20),
    },
    avatar: { width: wp(72), height: wp(72), borderRadius: wp(36) },
    headerInfo: { flex: 1, gap: hp(3) },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },

    // Stats
    statsRow: {
        flexDirection: 'row',
        paddingVertical: hp(10),
        paddingHorizontal: wp(10),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(8)
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: hp(8),
    },
    statIcon: {
        width: wp(44),
        height: wp(44),
        borderRadius: wp(22),
        backgroundColor: '#8F8F8F1A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.BORDER_COLOR,
    },

    // Properties
    section: {
        padding: wp(20),
        backgroundColor: Colors.INPUT_BACKGROUND,
        marginTop: hp(15),
        borderRadius: wp(8)
    },
    sectionLabel: {
        letterSpacing: 0.6,
        marginBottom: hp(12)
    },
    propertyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        backgroundColor: "#FBFBFB",
        borderRadius: wp(12),
        padding: wp(10),
        marginBottom: hp(10),
    },
    propertyThumb: { width: wp(80), height: hp(80), borderRadius: wp(8) },
    propertyInfo: { flex: 1, gap: hp(4) },

    // Footer
    footer: {
        flexDirection: 'row',

        paddingVertical: hp(16),
        gap: wp(12),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
   
});