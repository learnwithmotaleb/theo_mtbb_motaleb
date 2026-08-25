// components/shared/StaticContentScreen.tsx
import { Body6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsiveDevice';
import SectionTitle from '../shared/SectionTitle';

interface Section {
    heading?: string;
    body?: string;
    bullets?: string[];
}

interface Props {
    title: string;
    sections: Section[];
}

export function StaticContentScreen({ title, sections }: Props) {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.safe}>

            <SectionTitle title={title} />

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {sections.map((sec, i) => (
                    <View key={i} style={styles.section}>
                        {sec.heading && (
                            <Body6 color={Colors.PRIMARY_TEXT} style={styles.heading}>
                                {sec.heading}
                            </Body6>
                        )}
                        {sec.body ? (
                            <Body6 color={Colors.PRIMARY_TEXT} style={styles.body}>
                                {sec.body}
                            </Body6>
                        ) : null}
                        {sec.bullets?.map((b, j) => (
                            <View key={j} style={styles.bulletRow}>
                                <Body6 color={Colors.PRIMARY_TEXT}>{'•  '}</Body6>
                                <Body6 color={Colors.PRIMARY_TEXT} style={{ flex: 1 }}>{b}</Body6>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1,
         backgroundColor: Colors.APP_BACKGROUND,
         paddingHorizontal: wp(20),
        },
    
    
    scroll: { 
        paddingTop:hp(20),
        paddingBottom: hp(32)

     },
    section: { marginBottom: hp(8) },
    heading: {  marginBottom: hp(2) },
    body: { marginBottom: hp(4) },
    bulletRow: { flexDirection: 'row', paddingLeft: wp(8), marginBottom: hp(2) },
});