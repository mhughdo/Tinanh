import React, { useEffect } from 'react';
import { View } from 'react-native';
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
import firebaseAuth from '@react-native-firebase/auth';

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

function App() {
  const { auth, isInitializing } = useAuth();

  // useEffect(() => {
  //   firebaseAuth()
  //     .signOut()
  //     .then(() => console.log('User signed out!'));
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
