import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../containers/HomeScreen/HomeScreen';
import MessengerScreen from '../containers/MessengerScreen/MessengerScreen';
import ProfileScreen from '../containers/ProfileScreen/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MessengerStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
};

const MessengerStackScreen = () => {
  return (
    <MessengerStack.Navigator>
      <MessengerStack.Screen name="MessengerScreen" component={MessengerScreen} options={{ headerShown: false }} />
    </MessengerStack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
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
        <Tab.Screen name="Message" component={MessengerStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
