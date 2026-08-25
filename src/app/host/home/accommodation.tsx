import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Caption2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { ACCOMMODATIONS } from '@/data/hostFakeData';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function AccommodationScreen() {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState<string>(ACCOMMODATIONS[0]?.id ?? '');
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/host/home/recommended_cleaning' as any);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Accommodation" />

            <View style={styles.content}>
                <Body4 color={Colors.PRIMARY_TEXT}>Start by choosing a property</Body4>
                <Caption3 color={"#727272"} style={styles.subtitle}>
                    Select the property for which you would like to schedule a cleaning.
                </Caption3>

                <FlatList
                    data={ACCOMMODATIONS}
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
                                <Caption2 color={Colors.PRIMARY_TEXT} numberOfLines={2}>
                                    {item.name}
                                </Caption2>
                                <View style={styles.locationRow}>
                                    <LocationIcon size={18} color={Colors.TEXT_COLOR} />
                                    <Caption3 color={Colors.TEXT_COLOR}>{item.location}</Caption3>
                                </View>
                                <Caption2 color={Colors.PRIMARY_TEXT}>{item.price}</Caption2>

                                {/* Cleaner info if exists */}
                                {item.cleaner && selectedId === item.id && (
                                    <View style={styles.cleanerRow}>
                                        <Image
                                            source={item.cleaner.image}
                                            style={styles.cleanerAvatar}
                                            contentFit="cover"
                                        />
                                        <View>
                                            <Caption2 color={Colors.PRIMARY_TEXT}>
                                                {item.cleaner.name}
                                            </Caption2>
                                            <Caption3 color={"#727272"}>
                                                {item.cleaner.since}
                                            </Caption3>
                                        </View>
                                    </View>
                                )}
                            </View>

                            {/* Radio */}
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
                />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <CustomButton
                    title="Next"
                    onPress={handleNext}
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                    isLoading={loading}
                />
            </View>

            {/* Full screen loader */}
            {loading && (
                <View style={styles.loaderOverlay}>
                    <CustomLoader size={60} strokeWidth={4} />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20)
    },
    content: {
        flex: 1,
        marginTop: hp(5)
    },
    subtitle: {
         marginBottom: hp(16), 
        marginTop: hp(4) 
    },
    list: { 
        paddingBottom: hp(20)
     },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        padding: hp(5),
        borderRadius:wp(8),
        backgroundColor:Colors.INPUT_BACKGROUND,
        marginBottom:hp(10)
        // borderBottomWidth: 1,
        // borderBottomColor: Colors.BORDER_COLOR,
    },
    thumb: {
        width: wp(120),
        height: hp(140),
        borderRadius: wp(10),
    },
    info: {
        flex: 1,
        gap: hp(4)
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(4)
    },
    cleanerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        marginTop: hp(6),
    },
    cleanerAvatar: {
        width: wp(34),
        height: wp(34),
        borderRadius: wp(17),
    },
    radio: {
        width: wp(22),
        height: wp(22),
        borderRadius: wp(11),
        borderWidth: 2,
        borderColor: Colors.BORDER_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: { borderColor: "#0088FF" },
    radioDot: {
        width: wp(11),
        height: wp(11),
        borderRadius: wp(6),
        backgroundColor: "#0088FF",
    },
    footer: {
        // paddingBottom: wp(10),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFill, // Modern cross-platform approach
        backgroundColor: '#ffffff80',
        alignItems: 'center',
        justifyContent: 'center',
    },
});