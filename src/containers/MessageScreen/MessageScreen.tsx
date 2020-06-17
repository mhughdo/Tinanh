import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Message from '@components/Message';

const MessageScreen = () => {
  return (
    <SafeAreaView>
      <Message />
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({});
