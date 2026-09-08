// components/Profiles/StaticContentScreen.tsx
import { SkeletonText } from '@/components/shared/Skeleton';
import { Body6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { ContentType, useGetContentQuery } from '@/redux/services/miscApi';
import React, { useMemo } from 'react';
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
    /** Bundled copy — shown while loading, and if the page is not set up yet. */
    sections: Section[];
    /**
     * When given, the live page an admin publishes from the dashboard is
     * fetched and rendered instead of the bundled copy.
     */
    contentType?: ContentType;
}

// The backend stores one text blob (admins paste HTML or plain text). Strip the
// tags and split on blank lines so it renders with the same rhythm as the
// bundled sections.
const toSections = (content?: string): Section[] => {
    if (!content) return [];
    const text = content
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();

    return text
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => ({ body: block }));
};

export function StaticContentScreen({ title, sections, contentType }: Props) {
    const { data, isLoading } = useGetContentQuery(contentType as ContentType, {
        skip: !contentType,
    });

    const rendered = useMemo(() => {
        const live = toSections(data?.content);
        return live.length ? live : sections;
    }, [data, sections]);

    return (
        <SafeAreaView style={styles.safe}>

            <SectionTitle title={title} />

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {contentType && isLoading && !data ? (
                    <SkeletonText lines={6} />
                ) : null}

                {rendered.map((sec, i) => (
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
