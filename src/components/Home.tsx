import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import normalize from 'react-native-normalize';
import colors from '@constants/Colors';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import CardItem from '@components/CardItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '@shared/Header';
import { userType } from '@reducers/appReducer';
import functions, { firebase } from '@react-native-firebase/functions';
import { useNavigation } from '@react-navigation/native';
import { Spinner, Toast } from 'native-base';
import Colors from '@constants/Colors';
import fontSize from '@constants/fontSize';
import useAuth from '@hooks/useAuth';

const Home = ({ setIsVisible }: { setIsVisible: Function }) => {
  // const swiper = useRef<CardStack | null>();
  const [swiper, setSwiper] = useState<CardStack | null>();
  const [users, setUsers] = useState<Partial<userType>[]>([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        setLoading(true);
        const { data: users } = await functions().httpsCallable('getUsers')();
        const transformed = users
          .filter((user) => Boolean(user.dob))
          .map((user) => {
            if (user?.dob?._seconds) {
              return {
                ...user,
                dob: new firebase.firestore.Timestamp(user?.dob?._seconds, user?.dob?._nanoseconds),
              };
            }
          });
        setLoading(false);
        setUsers(transformed);
      } catch (error) {
        setLoading(false);
        Toast.show({
          text: 'Error getting users profile!',
          buttonText: 'Okay',
          type: 'warning',
          duration: 3000,
        });
        console.log(error);
        return;
      }
    };

    getAllUsers();
  }, []);

  const handleSwipedUporRight = async (idx: number, isSuperLike = false) => {
    try {
      const {
        data: { matches, user, messageBoxID },
      } = await functions().httpsCallable('swipedUpOrRight')({ id: users[idx].id, isSuperLike });
      if (matches) {
        navigation.navigate('MatchScreen', { user, messageBoxID });
      }
      //     console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSwipeLeft = async (idx: number) => {
    try {
      // console.log('object');
      await functions().httpsCallable('swipedLeft')({ id: users[idx].id });
    } catch (error) {
      console.log(error.message);
    }
  };

  const NoMoreCards = () => {
    return (
      <View style={styles.noMoreCardsContainer}>
        <Text style={styles.noMoreCardsText}>No more cards</Text>
      </View>
    );
  };

  return (
    <View style={styles.homeContaier}>
      <Header setIsVisible={setIsVisible} />
      <View style={styles.bodyContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Spinner color={Colors.mainTextColor} />
          </View>
        )}

        <CardStack
          style={styles.cardStackContainer}
          disableBottomSwipe
          secondCardZoom={1}
          renderNoMoreCards={users.length === 0 && !loading ? () => <NoMoreCards /> : () => null}
          // onSwiped={(index) => console.log(index)}
          onSwipedRight={handleSwipedUporRight}
          onSwipedTop={(idx) => handleSwipedUporRight(idx, true)}
          onSwipedLeft={handleSwipeLeft}
          ref={(cardSwiper) => {
            setSwiper(cardSwiper);
          }}>
          {users.map((user, index) => {
            const isSuperLike = auth?.isLiked?.find((userr) => userr.id === user.id)?.isSuperLike === true;

            return (
              <Card key={index} style={styles.cardContainer}>
                <CardItem user={user} isSuperLike={isSuperLike} />
              </Card>
            );
          })}
        </CardStack>
        {!loading && !!users.length && (
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
        )}
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
  noMoreCardsContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCardsText: {
    fontSize: fontSize.base,
    color: Colors.mainTextColor,
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 100,
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
