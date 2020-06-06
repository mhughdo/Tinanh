import React from 'react';
import { StyleSheet, Platform, StatusBar, View } from 'react-native';
import normalize from 'react-native-normalize';
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 35 : StatusBar.currentHeight;

const GeneralStatusBarColor = ({ backgroundColor, ...props }) => {
  return (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
};

export default GeneralStatusBarColor;

const styles = StyleSheet.create({
  statusBar: {
    height: normalize(STATUSBAR_HEIGHT, 'height'),
  },
});
