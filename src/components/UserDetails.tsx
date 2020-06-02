import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import normalize from 'react-native-normalize';
import fontSize from '@constants/fontSize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '@constants/Colors';

const carouselItems = [
  {
    title: 'Item 1',
    text: 'Text 1',
    image: require('../assets/images/profile_images/1.png'),
  },
  {
    title: 'Item 2',
    text: 'Text 2',
    image: require('../assets/images/profile_images/2.png'),
  },
  {
    title: 'Item 3',
    text: 'Text 3',
    image: require('../assets/images/profile_images/3.png'),
  },
  {
    title: 'Item 4',
    text: 'Text 4',
    image: require('../assets/images/profile_images/4.png'),
  },
  {
    title: 'Item 5',
    text: 'Text 5',
    image: require('../assets/images/profile_images/5.png'),
  },
];

const interested = [
  {
    name: 'md-airplane',
    title: 'Travel',
    color: '#ED8936',
  },
  {
    name: 'md-musical-note',
    title: 'Music',
    color: '#4299E1',
  },
  {
    name: 'logo-octocat',
    title: 'Animal',
    color: '#667EEA',
  },
  {
    name: 'md-heart',
    title: 'Romantic',
    color: '#ED64A6',
  },
];

const UserDetails = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [carouselRef, setCarouselRef] = useState();
  const route = useRoute();
  const { user } = route.params;

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <Image style={styles.itemImgContainer} source={item.image} />
      </View>
    );
  };

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
          <Carousel
            layout={'tinder'}
            ref={(ref) => setCarouselRef(ref)}
            data={carouselItems}
            sliderWidth={normalize(400)}
            itemWidth={normalize(400)}
            renderItem={renderItem}
            onSnapToItem={(index) => {
              setActiveIndex(index);
            }}
          />
        </View>
        <View style={styles.paginationContainer}>
          <Pagination
            dotsLength={carouselItems.length}
            activeDotIndex={activeIndex}
            containerStyle={{}}
            dotStyle={styles.dotStyle}
            inactiveDotStyle={
              {
                // Define styles for inactive dots here
              }
            }
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.nameAgeText}>
            {user.displayName}, {user.age}
          </Text>
          <View style={styles.schoolTextContainer}>
            <Ionicons name="md-school" size={normalize(16)} color={Colors.mainSubtextColor} />
            <Text style={styles.schoolText}>{user.school}</Text>
          </View>
          <View style={styles.distanceTextContainer}>
            <MaterialCommunityIcons name="map-marker-outline" size={normalize(16)} color={Colors.mainSubtextColor} />
            <Text style={styles.distanceText}>5 kilometers away</Text>
          </View>
          <View style={styles.bioContainer}>
            <View style={styles.bioHeaderContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="user" size={normalize(12)} color="white" />
              </View>
              <Text style={styles.bioHeaderText}>About</Text>
            </View>
            <Text style={styles.bioText}>This is a bio</Text>
          </View>
          <View style={styles.interestedContainer}>
            <View style={styles.interestedHeaderContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="map-marker-alt" size={normalize(12)} color="white" />
              </View>
              <Text style={styles.interestedText}>Interested</Text>
            </View>
            <View style={styles.interrestedListContainer}>
              {interested.map((item) => {
                return (
                  <View key={item.name} style={[styles.interestedHeaderContainer, styles.interestedItemContainer]}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: item.color, width: normalize(20), height: normalize(20) },
                      ]}>
                      <Ionicons name={item.name} size={normalize(10)} color="white" />
                    </View>
                    <Text style={styles.interestedItemText}>{item.title}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  paginationContainer: {
    position: 'absolute',
    top: normalize(410),
    left: normalize(80),
  },
  dotStyle: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    marginHorizontal: normalize(6),
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  itemContainer: {
    backgroundColor: 'floralwhite',
    borderRadius: normalize(5),
    overflow: 'hidden',
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width,
    // marginHorizontal: normalize(25),
  },
  itemImgContainer: { resizeMode: 'cover', width: '100%', height: '100%' },
  userInfoContainer: {
    position: 'absolute',
    paddingHorizontal: normalize(20),
    top: normalize(460),
  },
  nameAgeText: {
    fontWeight: '600',
    color: Colors.mainTextColor,
    fontSize: fontSize.xl,
  },
  schoolTextContainer: {
    flexDirection: 'row',
    marginTop: normalize(6),
  },
  schoolText: {
    marginLeft: normalize(10),
    color: Colors.mainSubtextColor,
  },
  distanceTextContainer: {
    flexDirection: 'row',
  },
  distanceText: {
    marginLeft: normalize(10),
    color: Colors.mainSubtextColor,
  },
  bioContainer: {
    marginTop: normalize(10),
  },
  bioHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bioHeaderText: {
    marginLeft: normalize(10),
    fontWeight: '500',
    fontSize: fontSize.sm,
  },
  iconContainer: {
    height: normalize(25),
    width: normalize(25),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(7),
    backgroundColor: '#E53E3E',
  },
  bioText: {
    marginTop: normalize(10),
    color: Colors.mainSubtextColor,
  },
  interestedContainer: {
    marginTop: normalize(10),
  },
  interestedHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestedText: {
    marginLeft: normalize(10),
    fontWeight: '500',
    fontSize: fontSize.sm,
  },
  interrestedListContainer: {
    marginTop: normalize(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestedItemContainer: {
    marginRight: normalize(10),
    marginBottom: normalize(10),
  },
  interestedItemText: {
    marginLeft: normalize(10),
    fontSize: fontSize.xs,
  },
});
