import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';


import { DownArrowIcon } from '@/assets/icons/common_icon/DownArrowIcon';
import { MinusIcon } from '@/assets/icons/host_icon/MinusIcon';
import { PlusIcon } from '@/assets/icons/host_icon/PlusIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Body6, Caption1, H2 } from '@/components/typo/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Studio', 'Duplex', 'Other'];

function Counter({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
}) {
    return (
        <View style={styles.counterBlock}>
            <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                {label}
            </Body5>
            <View style={styles.counterRow}>
                <Pressable
                    style={styles.counterBtn}
                    onPress={() => onChange(Math.max(0, value - 1))}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <MinusIcon size={20} color={Colors.TEXT_COLOR} />
                </Pressable>
                <Body5 color={Colors.TEXT_COLOR}>{String(value)}</Body5>
                <Pressable
                    style={styles.counterBtn}
                    onPress={() => onChange(value + 1)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <PlusIcon size={20} color={Colors.TEXT_COLOR} />
                </Pressable>
            </View>
        </View>
    );
}

function Dropdown({
    value,
    options,
    onChange,
}: {
    value: string;
    options: string[];
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Pressable
                style={styles.dropdownTrigger}
                onPress={() => setOpen(true)}
            >
                <Body6 color={Colors.PLACEHOLDER_TEXT}>{value}</Body6>
                <DownArrowIcon size={20} color={Colors.TEXT_COLOR} />
            </Pressable>

            <Modal visible={open} transparent animationType="fade">
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setOpen(false)}
                >
                    <View style={styles.dropdownList}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        onChange(item);
                                        setOpen(false);
                                    }}
                                >
                                    <Body6
                                        color={
                                            item === value
                                                ? Colors.STATUS_COLOR
                                                : Colors.TEXT_COLOR
                                        }
                                    >
                                        {item}
                                    </Body6>
                                </Pressable>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

export default function PropertyScreen() {
    const router = useRouter();
    const [type, setType] = useState('Apartment');
    const [bedrooms, setBedrooms] = useState(2);
    const [bathrooms, setBathrooms] = useState(2);
    const [toilets, setToilets] = useState(2);
    const [surface, setSurface] = useState('');
    const [surfaceError, setSurfaceError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = () => {
        if (!surface.trim()) {
            setSurfaceError('Surface area is required');
            return;
        }
        setSurfaceError('');
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/host/onboarding/cleaning_time');
        }, 800);
    };

    return (
        <SafeAreaView style={styles.safe}>
           <SectionTitle/>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <H2 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    Tell us about your property
                </H2>
                <Body6 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    This information helps us estimate the time and cost of the cleaning.
                </Body6>

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    Property type
                </Body5>
                <Dropdown value={type} options={PROPERTY_TYPES} onChange={setType} />

                <Counter label="Number of bedrooms" value={bedrooms} onChange={setBedrooms} />
                <Counter label="Number of bathrooms" value={bathrooms} onChange={setBathrooms} />
                <Counter label="Number of toilets" value={toilets} onChange={setToilets} />

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    Surface area (m²)
                </Body5>
                <View style={[styles.inputBox, surfaceError ? styles.inputError : null]}>
                    <TextInput
                        style={styles.input}
                        value={surface}
                        onChangeText={(t) => {
                            setSurface(t);
                            if (t.trim()) setSurfaceError('');
                        }}
                        placeholder="Ex: 75"
                        placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                        keyboardType="numeric"
                    />
                </View>
                {surfaceError ? (
                    <Caption1 color={Colors.COLOR_DANGER} style={styles.errorText}>
                        {surfaceError}
                    </Caption1>
                ) : null}
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    // onPress={handleContinue}
                    onPress={() => router.push('/host/onboarding/cleaning_time')}
                    title="Continue"
                    backgroundColor={Colors.BG_BLACK}
                    width="100%"
                    height={hp(54)}
                    borderRadius={wp(14)}
                    isLoading={isLoading}
                    disabled={isLoading}
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
    backBtn: {
        marginTop: hp(12),
        marginLeft: wp(20),
        width: wp(32),
    },
    scroll: {
       
        paddingBottom: hp(20),
    },
    title: {
        marginVertical: hp(10),
    },
    subtitle: {
        paddingHorizontal: wp(10),
        marginBottom: hp(28),
    },
    label: {
        marginBottom: hp(8),
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        height: hp(54),
        marginBottom: hp(16),
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        paddingHorizontal: wp(20),
    },
    dropdownList: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        overflow: 'hidden',
        maxHeight: hp(260),
    },
    dropdownItem: {
        paddingVertical: hp(14),
        paddingHorizontal: wp(18),
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_COLOR,
    },
    counterBlock: {
        marginBottom: hp(16),
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        height: hp(54),
    },
    counterBtn: {
        padding: wp(4),
    },
    inputBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        marginBottom: hp(4),
    },
    inputError: {
        borderColor: Colors.COLOR_DANGER,
    },
    input: {
        height: hp(54),
        color: Colors.TEXT_COLOR,
        fontFamily: 'Poppins_400Regular',
        fontSize: wp(15),
    },
    errorText: {
        marginBottom: hp(10),
    },
    footer: {
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});