import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Home from '@components/Home';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Home />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
