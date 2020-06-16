import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
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
