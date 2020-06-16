import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import users from '../data/users';
import normalize from 'react-native-normalize';
import Colors from '@constants/Colors';
import fontSize from '@constants/fontSize';
import { useNavigation } from '@react-navigation/native';
import functions from '@react-native-firebase/functions';
import { userType } from '@reducers/appReducer';

export default function Message() {
  const [matches, setMatches] = useState<Partial<userType>[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  useEffect(() => {
    const getMatches = async () => {
      try {
        setMatchesLoading(true);
        const { data } = await functions().httpsCallable('getMatches')();
        if (data?.length) {
          setMatches(data);
          setMatchesLoading(false);
        }
      } catch (error) {
        setMatchesLoading(false);
        console.log(error);
      }
    };

    getMatches();
  }, []);
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.matchesContainer}>
        <Text style={styles.matchesHeaderText}>Matches</Text>
        {!matchesLoading ? (
          matches.length ? (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {matches.map((user) => {
                return (
                  <View key={user.displayName} style={styles.matchUserContainer}>
                    <View style={styles.matchAvatarContainer}>
                      <Image source={{ uri: user.avatarURL }} style={styles.matchAvatar} />
                    </View>
                    <View style={styles.matchTextContainer}>
                      <Text style={styles.matchText}>{user.displayName}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.noMatchesText}>You have no matches</Text>
          )
        ) : null}
      </View>
      <View style={styles.messageSectionContainer}>
        <Text style={styles.messageHeaderText}>Messages</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {users.map((user) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate('MessageBox', { user })}>
                <View style={styles.userMessageContainer}>
                  <View style={styles.messageAvatarContainer}>
                    <Image source={user.images} style={styles.messageAvatar} />
                  </View>
                  <View style={styles.messageTextContainer}>
                    <Text style={styles.displayNameText}>{user.displayName}</Text>
                    <Text style={styles.latestMessageText}>aaa</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(10),
  },
  matchesContainer: {
    marginTop: normalize(20),
  },
  matchesHeaderText: {
    paddingBottom: normalize(10),
    color: 'red',
    fontSize: fontSize.sm,
  },
  matchUserContainer: {
    marginRight: normalize(10),
  },
  matchAvatarContainer: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(60 / 2),
    overflow: 'hidden',
  },
  matchAvatar: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  matchTextContainer: {
    marginTop: normalize(10),
  },
  matchText: {
    textAlign: 'center',
    color: Colors.mainSubtextColor,
  },
  noMatchesText: {
    fontSize: fontSize.xs,
  },
  messageSectionContainer: {
    marginTop: normalize(20),
  },
  messageHeaderText: {
    paddingBottom: normalize(10),
    color: 'red',
    fontSize: fontSize.sm,
  },
  userMessageContainer: {
    flexDirection: 'row',
    marginBottom: normalize(10),
  },
  messageAvatarContainer: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(60 / 2),
    overflow: 'hidden',
  },
  messageAvatar: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  messageTextContainer: {
    paddingLeft: normalize(10),
    justifyContent: 'space-around',
  },
  displayNameText: {
    fontSize: fontSize.base,
  },
  latestMessageText: {
    color: Colors.mainSubtextColor,
    fontSize: fontSize.sm,
  },
});
