import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import normalize from 'react-native-normalize';
import Colors from '@constants/Colors';
import fontSize from '@constants/fontSize';
import { useNavigation, useRoute } from '@react-navigation/native';
import { userType } from '@reducers/appReducer';
import { Spinner } from 'native-base';
import { db } from '@utils';
import { firebase } from '@react-native-firebase/firestore';
import useAuth from '@hooks/useAuth';
import FastImage from 'react-native-fast-image';
import users from '../data/users';

const partnerDatas: any = {};

export default function Message() {
  const [matches, setMatches] = useState<Partial<userType>[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { auth } = useAuth();
  const route = useRoute();

  const messageBoxIDs = auth?.messages?.map((item) => item.messageBoxID) || [];

  const userID = auth?.id || '';

  useEffect(() => {
    if (route.params?.unMatchUserID) {
      console.log(route.params?.unMatchUserID);

      if (matches.length) {
        setMatches(matches?.filter((match) => match.id !== route.params?.unMatchUserID));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.unMatchUserID]);

  useEffect(() => {
    try {
      let stillMounted = true;
      const unsubscribe = firebase
        .firestore()
        .doc(`users/${auth?.id}`)
        .onSnapshot(async (userSnapshot: any) => {
          let res: any[] = [];
          setMatchesLoading(true);
          const matchedUsers = userSnapshot.data()?.matches || [];

          for (const matchedUser of matchedUsers) {
            const matchedUserData = (await firebase.firestore().doc(`users/${matchedUser.id}`).get()).data();
            res.push(matchedUserData);
          }
          if (stillMounted) {
            if (res.length) {
              if (route.params?.unMatchUserID) {
                res = res?.filter((match) => match.id !== route.params?.unMatchUserID);
              }
              setMatches(res);
            }
            setMatchesLoading(false);
          }
        });
      return () => {
        stillMounted = false;
        unsubscribe();
      };
    } catch (error) {
      setMatchesLoading(false);
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.unMatchUserID]);

  useEffect(() => {
    try {
      let stillMounted = true;
      const unsubscribe = db
        .collection('messages')
        .orderBy('latestMessage.createdAt', 'desc')
        .onSnapshot(async (querySnapshot: any) => {
          setMessagesLoading(true);
          let messages: any[] = [];
          const messageSnapshots = querySnapshot.docs.filter((documentSnapshot: any) =>
            messageBoxIDs?.includes(documentSnapshot.id),
          );
          for (const messageSnapshot of messageSnapshots) {
            let partnerData = {};
            const partnerID = auth?.messages.find((item) => messageSnapshot.id === item.messageBoxID)
              ?.userIDs[1] as string;
            if (partnerDatas[partnerID]) {
              partnerData = partnerDatas[partnerID];
            } else {
              partnerData = (await db.doc(`users/${partnerID}`).get()).data();
              partnerDatas[partnerID] = partnerData;
            }
            messages.push({
              _id: messageSnapshot.id,
              name: '',
              // add this
              latestMessage: {
                text: '',
              },
              partner: partnerData,
              // ---
              ...messageSnapshot.data(),
            });
          }
          if (stillMounted) {
            if (messages.length) {
              if (route.params?.unMatchUserID) {
                messages = messages?.filter((message) => message.partner.id !== route.params?.unMatchUserID);
              }
              setMessages(messages);
            }
            setMessagesLoading(false);
          }
        });
      return () => {
        stillMounted = false;
        unsubscribe();
      };
    } catch (error) {
      setMessagesLoading(false);
      console.log(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.unMatchUserID]);

  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.matchesContainer}>
        <Text style={styles.matchesHeaderText}>Matches</Text>
        {!matchesLoading ? (
          matches.length ? (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {matches.map((user) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('MessageBox', {
                        messageBoxID: user?.messages?.find((item) => item.userIDs.includes(userID))?.messageBoxID,
                        user,
                      })
                    }
                    key={user.displayName}
                    style={styles.matchUserContainer}>
                    <View style={styles.matchAvatarContainer}>
                      <Image source={{ uri: user.avatarURL }} style={styles.matchAvatar} />
                    </View>
                    <View style={styles.matchTextContainer}>
                      <Text style={styles.matchText}>{user.displayName}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.noResultText}>You have no matches</Text>
          )
        ) : (
          <View>
            <Spinner color={Colors.mainSubtextColor} />
          </View>
        )}
      </View>
      <View style={styles.messageSectionContainer}>
        <Text style={styles.messageHeaderText}>Messages</Text>
        {!messagesLoading ? (
          messages?.length ? (
            <View>
              {messages?.map((message) => {
                return (
                  <TouchableOpacity
                    key={message.partner.id}
                    onPress={() =>
                      navigation.navigate('MessageBox', { user: message.partner, messageBoxID: message._id })
                    }>
                    <View style={styles.userMessageContainer}>
                      <View style={styles.messageAvatarContainer}>
                        <FastImage source={{ uri: message.partner.avatarURL }} style={styles.messageAvatar} />
                      </View>
                      <View style={styles.messageTextContainer}>
                        <Text style={styles.displayNameText}>{message.partner.displayName}</Text>
                        <Text style={styles.latestMessageText}>{message.latestMessage.text}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Text style={styles.noResultText}>You have no messages</Text>
          )
        ) : null}
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
  noResultText: {
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
