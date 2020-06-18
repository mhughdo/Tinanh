import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeScreen from '@containers/HomeScreen/HomeScreen';
import MessageScreen from '@containers/MessageScreen/MessageScreen';
import SettingsScreen from '@containers/SettingsScreen/SettingsScreen';
import AccountDetailsScreen from '@containers/AccountDetailsScreen/AccountDetailsScreen';
import ProfileScreen from '@containers/ProfileScreen/ProfileScreen';
import MatchScreen from '@components/ItsAMatch';
import UserDetailsScreen from '@components/UserDetails';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MessageBox from '@components/MessageBox';
import Colors from '@constants/Colors';
import normalize from 'react-native-normalize';
import { ActionSheet } from 'native-base';
import functions, { firebase } from '@react-native-firebase/functions';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const MessageStack = createStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen
        name="AccountDetailsScreen"
        component={AccountDetailsScreen}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
};

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ProfileStackScreen" component={ProfileStackScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="UserDetailsScreen" component={UserDetailsScreen} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
};

const MessageStackScreen = () => {
  return (
    <MessageStack.Navigator>
      <MessageStack.Screen name="MessageScreen" component={MessageScreen} options={{ headerShown: false }} />
      <MessageStack.Screen
        name="MessageBox"
        component={MessageBox}
        options={({ route, navigation }) => {
          const BUTTONS = ['UNMATCH', 'Cancel'];
          const CANCEL_INDEX = 4;

          return {
            title: route?.params?.user?.displayName || 'Message',
            headerLeft: () => (
              <Ionicons
                name="ios-arrow-back"
                size={28}
                style={{ paddingLeft: normalize(10) }}
                color={Colors.mainTextColor}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'MessageScreen' }],
                  });
                }}
              />
            ),
            headerRight: () => (
              <AntDesign
                name="setting"
                size={28}
                style={{ paddingRight: normalize(10) }}
                color={Colors.mainThemeForegroundColor}
                onPress={() => {
                  ActionSheet.show(
                    {
                      options: BUTTONS,
                      cancelButtonIndex: CANCEL_INDEX,
                      title: 'Actions',
                    },
                    (buttonIndex) => {
                      if (buttonIndex === 0) {
                        functions().httpsCallable('unMatch')({ id: route?.params?.user?.id });
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'MessageScreen', params: { unMatchUserID: route?.params?.user?.id } }],
                        });
                      }
                    },
                  );
                }}
              />
            ),
          };
        }}
      />
    </MessageStack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <MaterialCommunityIcons name="google-home" size={size} color={color} />;
          } else if (route.name === 'Message') {
            return <Ionicons name="ios-chatbubbles" size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Message" component={MessageStackScreen} />
    </Tab.Navigator>
  );
};

const Navigator = () => {
  return (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <RootStack.Screen name="MatchScreen" component={MatchScreen} options={{ headerShown: false }} />
    </RootStack.Navigator>
  );
};

export default Navigator;
