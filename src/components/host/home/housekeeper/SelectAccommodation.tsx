import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { Accommodation } from '@/types/dataTypes';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../../utils/responsiveDevice';

type Props = {
    accommodations: Accommodation[];
    housekeeperName: string;
    onSendRequest: (selected: Accommodation) => void;
    buttonLabel?: string;
};

export function SelectAccommodation({
    accommodations,
    housekeeperName,
    onSendRequest,
    buttonLabel = 'Send Request',
}: Props) {
    const [selectedId, setSelectedId] = useState<string>(accommodations[0]?.id ?? '');

    const selectedItem = accommodations.find((a) => a.id === selectedId);

    return (
        <View style={styles.container}>
            <FlatList
                data={accommodations}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.card}
                        onPress={() => setSelectedId(item.id)}
                    >
                        <Image
                            source={item.image}
                            style={styles.thumb}
                            contentFit="cover"
                        />
                        <View style={styles.info}>
                            <Caption3 color={Colors.PRIMARY_TEXT} numberOfLines={2}>
                                {item.name}
                            </Caption3>
                            <View style={styles.locationRow}>
                                <LocationIcon size={12} color={Colors.TEXT_COLOR} />
                                <Caption4 color={Colors.TEXT_COLOR}>{item.location}</Caption4>
                            </View>
                            <Caption4 color={Colors.PRIMARY_TEXT}>{item.price}</Caption4>
                        </View>

                        {/* Radio button */}
                        <View style={[
                            styles.radio,
                            selectedId === item.id && styles.radioSelected,
                        ]}>
                            {selectedId === item.id && (
                                <View style={styles.radioDot} />
                            )}
                        </View>
                    </Pressable>
                )}
                ListFooterComponent={
                    <View style={styles.noteBox}>
                        <Caption3 color={Colors.PRIMARY_TEXT}>
                            {housekeeperName} will be notified
                        </Caption3>
                        <Caption4 color={Colors.TEXT_COLOR}>
                            She will then be able to accept your invitation to begin working on the selected accommodation.
                        </Caption4>
                    </View>
                }
            />

            {/* Footer */}
            <View style={styles.footer}>
                <CustomButton
                    title={buttonLabel}
                    onPress={() => selectedItem && onSendRequest(selectedItem)}
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
    list: { paddingBottom: hp(20) },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        paddingVertical: hp(12),
        backgroundColor:Colors.INPUT_BACKGROUND,
        padding:hp(5),
        borderRadius: wp(8),
        marginBottom:hp(10)
    },
    thumb: {
        width: wp(80),
        height: hp(80),
        borderRadius: wp(10),
    },
    info: { flex: 1, gap: hp(4) },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    radio: {
        width: wp(22),
        height: wp(22),
        borderRadius: wp(11),
        borderWidth: 2,
        borderColor: Colors.BORDER_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: { borderColor: Colors.COLOR_ACTIVE },
    radioDot: {
        width: wp(11),
        height: wp(11),
        borderRadius: wp(6),
        backgroundColor: Colors.COLOR_ACTIVE,
    },
    noteBox: {
        backgroundColor: '#0909890D',
        borderRadius: wp(10),
        padding: wp(14),
        marginTop: hp(16),
        gap: hp(4),
    },
    footer: {
        // paddingBottom: wp(10),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
});