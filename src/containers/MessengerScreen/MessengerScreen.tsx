import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Message from '@components/Message';

const MessengerScreen = () => {
  return (
    <SafeAreaView>
      <Message />
    </SafeAreaView>
  );
};

export default MessengerScreen;

const styles = StyleSheet.create({});
