import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
import { StyleSheet } from 'react-native';
import normalize from 'react-native-normalize';

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
        options={({ route, navigation }) => ({
          title: route?.params?.user?.displayName || 'Message',
          headerLeft: () => (
            <Ionicons
              name="ios-arrow-back"
              size={28}
              style={{ paddingLeft: normalize(10) }}
              color={Colors.mainTextColor}
              onPress={() => navigation.replace('MessageScreen')}
            />
          ),
        })}
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
