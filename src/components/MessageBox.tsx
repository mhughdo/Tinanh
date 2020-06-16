import React, { useState } from 'react';
import { GiftedChat, Bubble, Send, IMessage, User } from 'react-native-gifted-chat';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import normalize from 'react-native-normalize';

type MessageType = Omit<IMessage, 'user'> & { user?: User | undefined };

export default function MessageBox() {
  const [messages, setMessages] = useState<MessageType[]>([
    /**
     * Mock message data
     */
    // example of system message

    // example of chat message
    {
      _id: 1,
      text: 'Henlo!',
      createdAt: new Date().getTime(),
      user: {
        _id: 1,
        name: 'Test User',
      },
    },
    {
      _id: 0,
      text: 'New room created.',
      createdAt: new Date().getTime(),
      system: true,
    },
  ]);

  // helper method that is sends a message
  const handleSend = (newMessage: MessageType[] = []) => {
    setMessages(GiftedChat.append(messages, newMessage));
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
      user={{ _id: 1, name: 'Test User' }}
      renderBubble={renderBubble}
      renderSend={renderSend}
      showUserAvatar
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      renderLoading={renderLoading}
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
