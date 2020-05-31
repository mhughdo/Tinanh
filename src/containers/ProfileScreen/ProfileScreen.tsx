import React from 'react';
import { View } from 'react-native';
import Profile from '@components/Profile';
import Header from '@shared/Header';

const ProfileScreen = () => {
  return (
    <View>
      <Header />
      <Profile />
    </View>
  );
};

export default ProfileScreen;
