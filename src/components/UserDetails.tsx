import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import normalize from 'react-native-normalize';
import fontSize from '@constants/fontSize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '@constants/Colors';
import { calculateAge } from '@utils';
import ProgressiveImage from './ProgressiveImage';

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
  {
    name: 'ios-camera',
    title: 'Photography',
    color: '#4FD1C5',
  },
];

const UserDetails: React.FC<{ swipable?: boolean }> = ({ swipable = false }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [carouselRef, setCarouselRef] = useState();
  const route = useRoute();
  const { user } = route.params;
  const unknownImg = require('../assets/images/unknown.png');

  const photos = Object.keys(user?.photos).length
    ? Object.keys(user.photos).map((key) => ({
        uri: user.photos[key].uri,
        thumbnail: user.photos[key].thumbnail,
      }))
    : [{}];

  const renderItem = ({ item, index }) => {
    const source = item.uri ? { uri: item.uri } : unknownImg;
    const thumbnailSource = item.thumbnail ? { uri: item.thumbnail } : unknownImg;

    return (
      <View style={styles.itemContainer}>
        <ProgressiveImage style={styles.itemImgContainer} thumbnailSource={thumbnailSource} source={source} />
      </View>
    );
  };

  return (
    <>
      <StatusBar hidden />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.carouselContainer}>
          <Carousel
            layout={'tinder'}
            ref={(ref) => setCarouselRef(ref)}
            data={photos}
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
            dotsLength={photos.length}
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
        {swipable && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.circle}>
              <Ionicons name="ios-heart" size={normalize(20)} color={Colors.onlineMarkColor} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.circle]}>
              <Ionicons name="md-close" size={normalize(20)} color={Colors.mainThemeForegroundColor} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.circle]}>
              <Ionicons name="ios-star" size={normalize(20)} color={Colors.blue} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.userInfoContainer}>
          <Text style={styles.nameAgeText}>
            {user.displayName}, {calculateAge(user.dob.toDate())}
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
            <Text style={styles.bioText}>T{user.bio}</Text>
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
      </ScrollView>
    </>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 2,
  },
  carouselContainer: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    // justifyContent: 'center',
    // flexDirection: 'row',
  },
  paginationContainer: {
    position: 'absolute',
    top: normalize(340, 'height'),
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
  buttonsContainer: {
    flexDirection: 'column',
    // width: '100%',
    paddingHorizontal: normalize(20),
    // borderWidth: 2,
    position: 'absolute',
    top: normalize(380, 'height'),
    right: 0,
    // justifyContent: 'space-between',
  },
  circle: {
    width: normalize(35),
    height: normalize(35),
    borderRadius: normalize(35 / 2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: normalize(5),
    // padding: normalize(10),
  },
  userInfoContainer: {
    position: 'absolute',
    paddingHorizontal: normalize(20),
    top: normalize(390, 'height'),
  },
  nameAgeText: {
    fontWeight: '600',
    color: Colors.mainTextColor,
    fontSize: normalize(fontSize.xl),
  },
  schoolTextContainer: {
    flexDirection: 'row',
    marginTop: normalize(6),
  },
  schoolText: {
    marginLeft: normalize(10),
    color: Colors.mainSubtextColor,
    fontSize: normalize(fontSize.xs),
  },
  distanceTextContainer: {
    flexDirection: 'row',
  },
  distanceText: {
    marginLeft: normalize(10),
    color: Colors.mainSubtextColor,
    fontSize: normalize(fontSize.xs),
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
    fontSize: normalize(fontSize.xs),
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
    marginTop: normalize(15),
    color: Colors.mainTextColor,
    fontSize: normalize(fontSize.xs),
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
    fontSize: normalize(fontSize.xs),
  },
  interrestedListContainer: {
    marginTop: normalize(15),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestedItemContainer: {
    marginRight: normalize(10),
    marginBottom: normalize(10),
  },
  interestedItemText: {
    marginLeft: normalize(10),
    fontSize: normalize(fontSize.xs),
  },
});
