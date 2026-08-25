import { SearchIcon } from '@/assets/icons/common_icon/SearchIcon';
import { Body5, Caption1, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { CLEANER_CONVERSATIONS } from '@/data/messagefakedata';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function CleanerMessageScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = CLEANER_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Body5
        color={Colors.PRIMARY_TEXT}
        style={styles.pageTitle}
      >
        Message
      </Body5>

      {/* Search */}
      <View style={styles.searchBox}>
        <SearchIcon size={18} color={Colors.TEXT_COLOR} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search here.."
          placeholderTextColor={Colors.PLACEHOLDER_TEXT}
        />
      </View>

      {/* Conversation list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: '/cleaner/message/chat' as any,
                params: { conversationId: item.id },
              })
            }
          >
            <Image
              source={item.image}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.rowInfo}>
              <Caption1 color={Colors.PRIMARY_TEXT}>{item.name}</Caption1>
              <Caption3
                color={Colors.TEXT_COLOR}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Caption3>
            </View>
            <Caption3 color={Colors.TEXT_COLOR}>{item.time}</Caption3>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
  pageTitle: {
    textAlign: 'center',
    paddingVertical: hp(14),
    fontFamily: 'Poppins_600SemiBold',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(10),
    backgroundColor: Colors.INPUT_BACKGROUND,
    borderRadius: wp(24),
    paddingHorizontal: wp(16),
    height: hp(46),
    marginBottom: hp(16),
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
  },
  searchInput: {
    flex: 1,
    color: Colors.PRIMARY_TEXT,
    fontFamily: 'Poppins_400Regular',
  },
  list: { paddingBottom: hp(100) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.INPUT_BACKGROUND,
    borderRadius: wp(10),
    marginBottom: hp(6),
    paddingHorizontal: hp(10),
    gap: wp(12),
    paddingVertical: hp(12),
  },
  avatar: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    flexShrink: 0,
  },
  rowInfo: {
    flex: 1,
    gap: hp(2),
  },
  separator: {
    height: 1,
    backgroundColor: Colors.BORDER_COLOR,
  },
});