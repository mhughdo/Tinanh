import React, { useState } from 'react';
import { View } from 'react-native';
import Profile from '@components/Profile';
import Header from '@shared/Header';
import Setting from '@components/Settings';

const ProfileScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View>
      <Header setIsVisible={setIsVisible} />
      <Profile />
      <Setting isVisible={isVisible} setIsVisible={setIsVisible} />
    </View>
  );
};

export default ProfileScreen;
