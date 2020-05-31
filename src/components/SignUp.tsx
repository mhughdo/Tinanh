import React, { useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';
import GoBackHeader from '@shared/GoBackHeader';
import fontSize from '@constants/fontSize';
import colors from '@constants/Colors';
import normalize from 'react-native-normalize';
import { Form, Item, Input, Button, Toast, Spinner } from 'native-base';
import auth from '@react-native-firebase/auth';
import { getSnapshotFromUserAuth } from '../utils/firebase';
import { useAppState } from '../store/appState';
import { AppActionType } from '../reducers/appReducer';

const isValidEmail = (email: string) => {
  let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(String(email).toLowerCase());
};

const SignUp = ({ navigation: { navigate } }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const { dispatch } = useAppState();

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword || !name) {
      Toast.show({
        text: 'All fields are required!',
        buttonText: 'Okay',
        type: 'warning',
        duration: 3000,
      });
    } else if (!isValidEmail(email)) {
      Toast.show({
        text: 'Email is not valid!',
        buttonText: 'Okay',
        type: 'warning',
        duration: 3000,
      });
    } else if (password.length < 8 || confirmPassword.length < 8) {
      Toast.show({
        text: 'Min password length is 8',
        buttonText: 'Okay',
        type: 'warning',
        duration: 3000,
      });
    } else if (password !== confirmPassword) {
      Toast.show({
        text: 'Password and Confirm Password does not match!',
        buttonText: 'Okay',
        type: 'warning',
        duration: 3000,
      });
    }

    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (data) => {
        const isNewUser = data.additionalUserInfo?.isNewUser;
        const userSnapshot = await getSnapshotFromUserAuth(data.user, { isNewUser, displayName: name });
        if (userSnapshot) {
          dispatch({ type: AppActionType.AUTH_CHANGE, auth: { id: userSnapshot.id, ...userSnapshot.data() } });
        }

        setLoading(false);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Toast.show({
            text: 'That email address is already in use!',
            buttonText: 'Okay',
            type: 'warning',
            duration: 3000,
          });
        }

        if (error.code === 'auth/invalid-email') {
          Toast.show({
            text: 'That email address is invalid!!',
            buttonText: 'Okay',
            type: 'warning',
            duration: 3000,
          });
        }
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <SafeAreaView>
      <GoBackHeader />
      <View style={styles.signUpHeaderContainer}>
        <Text style={styles.signUpHeader}>Create new account</Text>
      </View>
      <View style={styles.inputContainer}>
        <Form>
          <Item
            style={{
              marginBottom: normalize(20),
            }}
            regular
            rounded>
            <Input
              style={{
                paddingLeft: normalize(20),
                fontSize: normalize(fontSize.xs),
              }}
              autoCapitalize="none"
              onChangeText={setName}
              value={name}
              placeholder="Name"
            />
          </Item>
          <Item
            style={{
              marginBottom: normalize(20),
            }}
            regular
            rounded>
            <Input
              style={{
                paddingLeft: normalize(20),
                fontSize: normalize(fontSize.xs),
              }}
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
              placeholder="E-mail Address"
            />
          </Item>
          <Item
            style={{
              marginBottom: normalize(20),
            }}
            regular
            rounded>
            <Input
              style={{
                paddingLeft: normalize(20),
                fontSize: normalize(fontSize.xs),
              }}
              secureTextEntry={true}
              autoCapitalize="none"
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
            />
          </Item>
          <Item
            style={{
              marginBottom: normalize(20),
            }}
            regular
            rounded>
            <Input
              style={{
                paddingLeft: normalize(20),
                fontSize: normalize(fontSize.xs),
              }}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              placeholder="Confirm Password"
            />
          </Item>
        </Form>
      </View>
      <View style={styles.signUpButtonContainer}>
        <Button disabled={loading} style={styles.signUpButton} rounded onPress={handleSignUp}>
          {loading ? (
            <Spinner color="white" />
          ) : (
            <Text
              style={{
                color: 'white',
              }}>
              Sign Up
            </Text>
          )}
        </Button>
      </View>
      <View style={styles.toSignInContainer}>
        <Text style={styles.toSignInText}>
          Already have an account?{' '}
          <Text onPress={() => navigate('LogIn')} style={styles.signInText}>
            Sign In
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  signUpHeaderContainer: {
    paddingLeft: normalize(20),
  },
  signUpHeader: {
    fontSize: normalize(fontSize.xl),
    color: colors.mainThemeForegroundColor,
    fontWeight: '500',
  },
  inputContainer: {
    marginTop: normalize(40),
    paddingHorizontal: normalize(40),
  },
  signUpButtonContainer: {
    paddingHorizontal: normalize(50),
    marginTop: normalize(10),
  },
  signUpButton: {
    justifyContent: 'center',
    fontSize: normalize(fontSize.base),
    fontWeight: '500',
    backgroundColor: colors.mainThemeForegroundColor,
  },
  toSignInContainer: {
    marginTop: normalize(10),
    paddingHorizontal: normalize(52),
  },
  toSignInText: {
    textAlign: 'right',
  },
  signInText: {
    color: colors.mainThemeForegroundColor,
  },
});
