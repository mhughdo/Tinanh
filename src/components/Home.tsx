import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import Octicons from 'react-native-vector-icons/Octicons';
import normalize from 'react-native-normalize';
import Logo from '@images/Logo';
import colors from '@constants/Colors';
import GeneralStatusBarColor from '@components/GeneralStatusBarColor';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import CardItem from '@components/CardItem';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Home = () => {
  return (
    <View style={styles.homeContaier}>
      <GeneralStatusBarColor backgroundColor="white" />
      <View style={styles.headerContainer}>
        <Octicons color={colors.grey9} name="person" size={28} />
        <Logo height={28} width={28} />
        <Octicons color={colors.grey9} name="settings" size={28} />
      </View>
      <View style={styles.bodyContainer}>
        <CardStack
          style={styles.cardStackContainer}
          disableBottomSwipe
          secondCardZoom={1}
          renderNoMoreCards={() => null}
          ref={(swiper) => {
            this.swiper = swiper;
          }}>
          {Array.from({ length: 20 }).map((_, index) => {
            return (
              <Card style={styles.cardContainer}>
                <CardItem key={index} index={index} />
              </Card>
            );
          })}
        </CardStack>
        <View style={styles.buttonsContainer}>
          <View style={[styles.circle]}>
            <Ionicons name="md-close" size={40} color={colors.mainThemeForegroundColor} />
          </View>
          <View style={[styles.circle, styles.smallCircle]}>
            <Ionicons name="ios-star" size={30} color={colors.blue} />
          </View>
          <View style={styles.circle}>
            <Ionicons name="ios-heart" size={36} color={colors.onlineMarkColor} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  homeContaier: {
    flexGrow: 1,
  },
  bodyContainer: {
    flexGrow: 1,
    // backgroundColor: 'red',
  },
  headerContainer: {
    backgroundColor: 'white',
    paddingHorizontal: normalize(30),
    paddingBottom: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 99,
    elevation: 99,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: normalize(10),
    paddingHorizontal: normalize(40),
    borderWidth: 2,
    justifyContent: 'space-between',
  },
  circle: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // padding: normalize(10),
  },
  smallCircle: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    alignSelf: 'flex-end',
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
