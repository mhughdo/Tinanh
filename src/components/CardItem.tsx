import React from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import normalize from 'react-native-normalize';
import images from '@utils/images';

const CardItem = ({ index }) => {
  // const img = require();

  return (
    <View style={styles.cardItemContainer}>
      <Image style={styles.img} source={images[`image${index}`]} />
    </View>
  );
};

export default CardItem;

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '100%',
  },
  cardItemContainer: {
    overflow: 'hidden',
    marginTop: normalize(10),
    marginHorizontal: normalize(15),
    borderRadius: normalize(15),
    width: Dimensions.get('window').width - normalize(30),
    height: Dimensions.get('window').height - normalize(250),
    // backgroundColor: colors.mainThemeForegroundColor,
    // justifyContent: 'center',
    alignItems: 'center',
  },
});
