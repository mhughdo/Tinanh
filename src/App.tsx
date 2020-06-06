import React, { useEffect, useState } from 'react';
import { View, Platform, PermissionsAndroid } from 'react-native';
import { Root } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navigator from './navigators/Navigator';
import LoginScreen from '@components/Login';
import OpeningScreen from '@components/OpeningScreen';
import { AppStateProvider } from './store/appState';
import { appStateReducer } from './reducers/appReducer';
import SignUpScreen from '@components/SignUp';
import Logo from '@images/Logo';
import useAuth from './hooks/useAuth';
import AddUserInfoScreen from '@components/AddUserInfo';
import Geolocation from 'react-native-geolocation-service';
import firebaseAuth from '@react-native-firebase/auth';
import functions, { firebase } from '@react-native-firebase/functions';

// Use a local emulator in development
if (__DEV__) {
  functions().useFunctionsEmulator('http://localhost:5001');
}

//WARNING SUPPRESSION
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
]);

function SplashScreen() {
  return (
    <View
      style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Logo height={100} width={100} />
    </View>
  );
}

const Stack = createStackNavigator();

const requestPermission = async () => {
  if (Platform.OS !== 'android') {
    Geolocation.requestAuthorization();
  } else {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Tin anh',
        message: "App needs access to your phone's location",
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

function App() {
  const { auth, isInitializing } = useAuth();
  // useEffect(() => {
  //   firebaseAuth()
  //     .signOut()
  //     .then(() => console.log('User signed out!'));
  // }, []);

  // useEffect(() => {
  //   async function getData() {
  //     const data = await functions().httpsCallable('listProducts')();
  //     console.log(data);
  //   }

  //   getData();
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isInitializing ? (
          // We haven't finished checking for the token yet
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />
        ) : auth === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen
              name="Opening"
              component={OpeningScreen}
              options={{
                headerShown: false,
                // When logging out, a pop animation feels intuitive
                // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen
              name="LogIn"
              component={LoginScreen}
              options={{
                headerShown: false,
                // When logging out, a pop animation feels intuitive
                // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                headerShown: false,
                // When logging out, a pop animation feels intuitive
                // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          </>
        ) : auth.isNewUser === true ? (
          <>
            <Stack.Screen
              name="AddUserInfo"
              component={AddUserInfoScreen}
              options={{
                headerShown: false,
                // When logging out, a pop animation feels intuitive
                // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          </>
        ) : (
          // User is signed in
          <Stack.Screen
            name="Home"
            component={Navigator}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return (
    <AppStateProvider reducer={appStateReducer}>
      <Root>
        <App />
      </Root>
    </AppStateProvider>
  );
};
