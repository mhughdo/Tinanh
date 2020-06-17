import React, { useState, useEffect } from 'react';
import { GiftedChat, Bubble, Send, IMessage, User } from 'react-native-gifted-chat';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import normalize from 'react-native-normalize';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '@utils';
import useAuth from '@hooks/useAuth';

type MessageType = Omit<IMessage, 'user'> & { user?: User | undefined };

export default function MessageBox() {
  const route = useRoute();
  const { messageBoxID, user: partnerData } = route.params;
  const { auth } = useAuth();
  const navigation = useNavigation();

  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (messageBoxID) {
      return db
        .collection('messages')
        .doc(messageBoxID)
        .collection('MESSAGES')
        .orderBy('createdAt', 'desc')
        .onSnapshot((querySnapshot: any) => {
          const messages = querySnapshot.docs.map((doc) => {
            const firebaseData = doc.data();

            const data = {
              _id: doc.id,
              text: '',
              createdAt: new Date().getTime(),
              ...firebaseData,
            };

            if (!firebaseData.system) {
              data.user = {
                ...firebaseData.user,
                name: firebaseData.user.name,
              };
            }

            return data;
          });

          setMessages(messages);
        });
    }
  }, [messageBoxID]);

  // helper method that is sends a message
  const handleSend = async (newMessages: MessageType[] = []) => {
    try {
      const text = newMessages[0].text;

      setMessages(GiftedChat.append(messages, newMessages));
      await db
        .collection('messages')
        .doc(messageBoxID)
        .collection('MESSAGES')
        .add({
          text,
          createdAt: new Date().getTime(),
          user: {
            _id: auth?.id,
            name: auth?.displayName,
            avatar: auth?.avatarURL,
          },
        });
      db.collection('messages')
        .doc(messageBoxID)
        .set(
          {
            latestMessage: {
              text,
              createdAt: new Date().getTime(),
              userID: auth?.id,
            },
          },
          { merge: true },
        );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePressAvatar = (user) => {
    const userData = user._id === auth?.id ? auth : partnerData;

    navigation.navigate('Home', {
      screen: 'UserDetailsScreen',
      params: {
        user: userData,
      },
    });
  };

  const scrollToBottomComponent = () => {
    return (
      <View style={styles.bottomComponentContainer}>
        <Ionicons name="ios-arrow-down" size={36} color="#6646ee" />
      </View>
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <Ionicons name="md-send" size={32} color={Colors.blue} />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: Colors.mainThemeForegroundColor,
          },
          left: {
            backgroundColor: Colors.grey6,
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage)}
      placeholder="Type your message here..."
      user={{ _id: auth?.id, name: auth?.displayName }}
      renderBubble={renderBubble}
      renderSend={renderSend}
      showUserAvatar
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      renderLoading={renderLoading}
      onPressAvatar={handlePressAvatar}
    />
  );
}

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(5),
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
