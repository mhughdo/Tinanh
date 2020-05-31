import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Logo from '@images/Logo';
import GeneralStatusBarColor from '@components/GeneralStatusBarColor';
import colors from '@constants/Colors';
import Octicons from 'react-native-vector-icons/Octicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import normalize from 'react-native-normalize';

const Header = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View>
      <GeneralStatusBarColor backgroundColor="white" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileStackScreen')}>
          <Octicons
            color={route.name === 'ProfileScreen' ? colors.mainThemeForegroundColor : colors.grey9}
            name="person"
            size={28}
          />
        </TouchableOpacity>
        <Logo height={28} width={28} />
        <Octicons color={colors.grey9} name="settings" size={28} />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    paddingHorizontal: normalize(10),
    paddingBottom: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
