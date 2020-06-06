import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import normalize from 'react-native-normalize';
import colors from '@constants/Colors';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import CardItem from '@components/CardItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '@shared/Header';
// import fakeUsers from '../data/users';
import { db } from '@utils/index';
import useAuth from '@hooks/useAuth';
import { userType } from '@reducers/appReducer';

const Home = () => {
  // const swiper = useRef<CardStack | null>();
  const [swiper, setSwiper] = useState<CardStack | null>();
  const [users, setUsers] = useState<Partial<userType>[]>([]);
  const { auth } = useAuth();

  useEffect(() => {
    const getAllUsers = async () => {
      const users = (await db.collection('users').get()).docs
        .filter((user) => user.data().email !== auth?.email)
        .map((user) => user.data());
      setUsers(users);
    };

    getAllUsers();
  }, []);

  return (
    <View style={styles.homeContaier}>
      <Header />
      <View style={styles.bodyContainer}>
        <CardStack
          style={styles.cardStackContainer}
          disableBottomSwipe
          secondCardZoom={1}
          renderNoMoreCards={users.length === 0 ? () => <Text>No more cards</Text> : () => null}
          // onSwiped={(index) => console.log(index)}
          onSwipedRight={(index) => console.log(index)}
          ref={(cardSwiper) => {
            setSwiper(cardSwiper);
          }}>
          {users.map((user, index) => {
            return (
              <Card style={styles.cardContainer}>
                <CardItem key={index} user={user} />
              </Card>
            );
          })}
        </CardStack>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => swiper?.swipeLeft()} style={[styles.circle]}>
            <Ionicons name="md-close" size={35} color={colors.mainThemeForegroundColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => swiper?.swipeTop()} style={[styles.circle, styles.smallCircle]}>
            <Ionicons name="ios-star" size={25} color={colors.blue} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => swiper?.swipeRight()} style={styles.circle}>
            <Ionicons name="ios-heart" size={35} color={colors.onlineMarkColor} />
          </TouchableOpacity>
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
    // borderWidth: 2,
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
