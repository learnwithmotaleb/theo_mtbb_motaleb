import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { StarCircleIcon } from '@/assets/icons/cleaner_icon/StarCircleIcon';
import { TrashIcon } from '@/assets/icons/common_icon/TrashIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Body5, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';
import { getApiErrorMessage } from '@/lib/apiError';
import { accommodationLocation, accommodationPhoto, personName } from '@/lib/mappers';
import {
    useGetMyCleanerAccommodationsQuery,
    useRespondToAssignmentMutation,
} from '@/redux/services/assignmentApi';
import { AppImage } from '@/components/shared/AppImage';
import React, { useMemo } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Client = {
    /** The assignment id — what "leave this client" acts on. */
    id: string;
    title: string;
    address: string;
    owner: string;
    isPrimary: boolean;
    image: any;
};

function ClientCard({
    item,
    onRemove,
}: {
    item: Client;
    onRemove: (id: string) => void;
}) {
    const t = useT();
    const handleDelete = () =>
        Alert.alert(
            t("Leave this client"),
            t("You will stop being assigned to this accommodation."),
            [
                { text: t("Cancel"), style: 'cancel' },
                {
                    text: t("Leave"),
                    style: 'destructive',
                    onPress: () => onRemove(item.id),
                },
            ],
        );

    return (
        <View style={clientStyles.card}>
            {/* Thumbnail */}
            <AppImage source={item.image} style={clientStyles.thumb} contentFit="cover" />

            {/* Info */}
            <View style={clientStyles.info}>
                <Body5 color={Colors.PRIMARY_TEXT}>{item.title}</Body5>

                <View style={clientStyles.metaRow}>
                    <LocationIcon size={12} color={Colors.TEXT_COLOR} />
                    <Caption3 color={Colors.TEXT_COLOR}>{item.address}</Caption3>
                </View>
                <View style={clientStyles.metaRow}>
                    <UserIcon size={12} color={Colors.COLOR_ACTIVE} />
                    <Caption3 color={Colors.TEXT_COLOR}>{item.owner}</Caption3>
                </View>

                {/* Badge + delete */}
                <View style={clientStyles.footer}>
                    <View style={[
                        clientStyles.badge,
                        item.isPrimary ? clientStyles.badgePrimary : clientStyles.badgeSecondary,
                    ]}>
                        {item.isPrimary && (
                            <StarCircleIcon />
                        )}
                        <Caption3 color={item.isPrimary ? Colors.COLOR_ACTIVE : Colors.TEXT_COLOR}>
                            {item.isPrimary ? 'Principal' : 'Secondary'}
                        </Caption3>
                    </View>

                    <Pressable style={clientStyles.deleteBtn} onPress={handleDelete}>
                        <TrashIcon size={16} color={Colors.COLOR_DANGER} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default function MyClientsScreen() {
    const t = useT();
    // "My clients" are the assignments this cleaner accepted.
    const { data, isLoading, refetch } = useGetMyCleanerAccommodationsQuery({
        page: 1,
        limit: 50,
    });
    const { refreshing, onRefresh } = useRefresh([refetch]);
    const [respond] = useRespondToAssignmentMutation();

    const clients = useMemo<Client[]>(
        () =>
            (data?.data ?? []).map((assignment) => {
                const accommodation = assignment.accommodation as any;
                return {
                    id: assignment._id,
                    title: accommodation?.name ?? 'Accommodation',
                    address: accommodationLocation(accommodation),
                    owner: personName(assignment.host as any, 'Host'),
                    isPrimary: assignment.role === 'primary',
                    image: accommodationPhoto(accommodation),
                };
            }),
        [data],
    );

    // Refusing an accepted assignment is how a cleaner steps away from it.
    const handleRemove = async (assignmentId: string) => {
        try {
            await respond({ assignmentId, action: 'refuse' }).unwrap();
            showToast(t("You have left this client"), 'success');
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not update the assignment.")), 'error');
        }
    };

    return (
        <SafeAreaView style={clientStyles.safe}>
            <SectionTitle title={t("My Clients")} />
            <FlatList
                data={clients}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ClientCard item={item} onRemove={handleRemove} />
                )}
                contentContainerStyle={clientStyles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    isLoading ? (
                        <SkeletonList count={3} variant="row" />
                    ) : (
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {t("No clients yet — accept a request to get started.")}
                        </Caption3>
                    )
                }
            />
        </SafeAreaView>
    );
}

const clientStyles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
    list: {
        paddingBottom: hp(40),
        paddingTop: hp(12),
        gap: hp(12)
    },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
         padding:5
    },
    thumb: {
        width: wp(110),
        height: '100%',
        borderRadius: wp(20),
       
    },
    info: { flex: 1, padding: wp(12), gap: hp(4) },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    footer: { flexDirection: 'row', alignItems: 'center', gap: wp(8), marginTop: hp(6) },
    badge: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(4),
        paddingVertical: hp(5),
        borderRadius: wp(8),
        borderWidth: 1,
    },
    badgePrimary: {
        borderColor: Colors.COLOR_ACTIVE,
        backgroundColor: '#35A9D61A',
    },
    badgeSecondary: {
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.APP_BACKGROUND,
    },
    badgeDot: {
        width: wp(8), height: wp(8),
        borderRadius: wp(4),
        backgroundColor: Colors.COLOR_ACTIVE,
    },
    deleteBtn: {
        width: wp(48), height: wp(32),
        borderRadius: wp(8),
        backgroundColor: '#FF3B301A',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FF3B3030',
    },
});