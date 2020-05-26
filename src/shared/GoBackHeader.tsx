import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import normalize from 'react-native-normalize';
import { Button } from 'native-base';
import colors from '@constants/Colors';
import { useNavigation } from '@react-navigation/native';

const GoBackHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.goBack()} transparent>
        <Ionicons name="ios-arrow-back" size={30} color={colors.mainThemeForegroundColor} />
      </Button>
    </View>
  );
};

export default GoBackHeader;

const styles = StyleSheet.create({
  container: {
    paddingLeft: normalize(10),
    width: normalize(50),
    marginBottom: normalize(10),
  },
});
