import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import HomeScreen from '../containers/HomeScreen/HomeScreen';
import MatchesScreen from '../containers/MatchesScreen/MatchesScreen';
import MessengerScreen from '../containers/MessengerScreen/MessengerScreen';
import ProfileScreen from '../containers/ProfileScreen/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();
const MatchesStack = createStackNavigator();
const MessengerStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
};

const MatchesStackScreen = () => {
  return (
    <MatchesStack.Navigator>
      <MatchesStack.Screen name="MatchesScreen" component={MatchesScreen} options={{ headerShown: false }} />
    </MatchesStack.Navigator>
  );
};

const MessengerStackScreen = () => {
  return (
    <MessengerStack.Navigator>
      <MessengerStack.Screen name="MessengerScreen" component={MessengerScreen} options={{ headerShown: false }} />
    </MessengerStack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="HomeScreen" component={HomeStackScreen} />
        <Tab.Screen name="MatchesScreen" component={MatchesStackScreen} />
        <Tab.Screen name="MessengerScreen" component={MessengerStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
