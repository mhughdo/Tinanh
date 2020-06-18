import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Home from '@components/Home';
import Setting from '@components/Settings';

const HomeScreen = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Home setIsVisible={setIsVisible} />
      <Setting isVisible={isVisible} setIsVisible={setIsVisible} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
