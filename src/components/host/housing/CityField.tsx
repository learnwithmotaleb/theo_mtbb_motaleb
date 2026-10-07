import { SearchIcon } from '@/assets/icons/common_icon/SearchIcon';
import { Body6, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useT } from '@/i18n';
import { Commune, POPULAR_CITIES, searchCommunes } from '@/lib/frenchGeo';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Props = {
    label: string;
    value: string;
    /**
     * `commune` is set when the host picked a suggestion (its postal codes are
     * then known), and null while they type a name freely.
     */
    onChange: (city: string, commune: Commune | null) => void;
};

/**
 * Any French city, not a fixed list: the host types and picks from live
 * suggestions, with the five big cities offered as quick picks. Typing a name
 * that is not in the suggestions is still allowed — the postal-code check on
 * Continue confirms it.
 */
export function CityField({ label, value, onChange }: Props) {
    const t = useT();
    const [focused, setFocused] = useState(false);
    const [results, setResults] = useState<Commune[]>([]);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    // The suggestion list closes once a commune is picked, until the host types again.
    const [picked, setPicked] = useState(false);
    const latest = useRef(0);

    const query = value.trim();

    useEffect(() => {
        if (picked || query.length < 2) return;
        const ticket = ++latest.current;
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const found = await searchCommunes(query, controller.signal);
                if (ticket === latest.current) {
                    setResults(found);
                    setFailed(false);
                }
            } catch {
                if (ticket === latest.current && !controller.signal.aborted) {
                    setResults([]);
                    setFailed(true);
                }
            } finally {
                if (ticket === latest.current) setLoading(false);
            }
        }, 300);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query, picked]);

    const pick = (commune: Commune) => {
        setPicked(true);
        setResults([]);
        onChange(commune.name, commune.postalCodes.length ? commune : null);
    };

    // Quick picks carry no postal codes yet: look the city up so its codes
    // are known, falling back to the bare name if the service is unreachable.
    const pickPopular = async (city: Commune) => {
        setPicked(true);
        onChange(city.name, null);
        try {
            const found = await searchCommunes(city.name);
            const match = found.find(
                (c) => c.name === city.name && c.department === city.department,
            );
            if (match) onChange(match.name, match);
        } catch {
            /* the name alone is enough; Continue re-checks the postal code */
        }
    };

    const showSuggestions = focused && !picked && query.length >= 2;
    const showPopular = focused && query.length < 2;

    return (
        <View style={styles.wrapper}>
            <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                {label}
            </Body6>
            <View style={[styles.inputBox, focused && styles.inputFocused]}>
                <SearchIcon size={16} color={Colors.TEXT_COLOR} />
                <TextInput
                    style={styles.input}
                    placeholder={t('Search for a city')}
                    placeholderTextColor={Colors.TEXT_COLOR}
                    value={value}
                    onChangeText={(text) => {
                        setPicked(false);
                        onChange(text, null);
                    }}
                    onFocus={() => setFocused(true)}
                    // Delay so a tap on a suggestion lands before the list hides.
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    textContentType="addressCity"
                />
                {loading && <ActivityIndicator size="small" color={Colors.TEXT_COLOR} />}
            </View>

            {showPopular && (
                <View style={styles.chips}>
                    {POPULAR_CITIES.map((city) => (
                        <Pressable
                            key={city.name}
                            style={styles.chip}
                            onPress={() => pickPopular(city)}
                        >
                            <Caption3 color={Colors.PRIMARY_TEXT}>{city.name}</Caption3>
                        </Pressable>
                    ))}
                </View>
            )}

            {showSuggestions && (
                <View style={styles.list}>
                    {results.map((commune) => (
                        <Pressable
                            key={`${commune.name}-${commune.department}`}
                            style={styles.option}
                            onPress={() => pick(commune)}
                        >
                            <Caption3 color={Colors.PRIMARY_TEXT} style={{ flex: 1 }}>
                                {commune.name}
                            </Caption3>
                            <Caption4 color={Colors.TEXT_COLOR}>
                                {commune.postalCodes.length === 1
                                    ? commune.postalCodes[0]
                                    : `(${commune.department})`}
                            </Caption4>
                        </Pressable>
                    ))}
                    {!loading && results.length === 0 && (
                        <Caption4 color={Colors.TEXT_COLOR} style={styles.hint}>
                            {failed
                                ? t('City suggestions are unavailable. You can type the city name.')
                                : t('No city found. Check the spelling.')}
                        </Caption4>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginBottom: hp(20) },
    label: { marginBottom: hp(8), fontFamily: 'Poppins_500Medium' },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputFocused: { borderColor: '#0088FF' },
    input: {
        flex: 1,
        fontSize: 13,
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        padding: 0,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(8), marginTop: hp(10) },
    chip: {
        paddingHorizontal: wp(12),
        paddingVertical: hp(6),
        borderRadius: wp(16),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.INPUT_BACKGROUND,
    },
    list: {
        marginTop: hp(6),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        overflow: 'hidden',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(16),
        paddingVertical: hp(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    hint: { paddingHorizontal: wp(16), paddingVertical: hp(12) },
});
