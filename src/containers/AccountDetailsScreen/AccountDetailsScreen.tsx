import React from 'react';
import { StyleSheet, View } from 'react-native';
import AccountDetails from '@components/AccountDetails';
import GeneralStatusBarColor from '@components/GeneralStatusBarColor';

const AccountDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <GeneralStatusBarColor backgroundColor="white" />
      <AccountDetails />
    </View>
  );
};

export default AccountDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
