import React, { useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';
import GoBackHeader from '@shared/GoBackHeader';
import fontSize from '@constants/fontSize';
import colors from '@constants/Colors';
import normalize from 'react-native-normalize';
import { Form, Item, Input, Button } from 'native-base';

const Login = ({ navigation: { navigate } }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const {signIn} = useContext(authContext)

  return (
    <SafeAreaView>
      <GoBackHeader />
      <View style={styles.logInHeaderContainer}>
        <Text style={styles.logInHeader}>Sign In</Text>
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
                fontSize: fontSize.xs,
              }}
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
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
                fontSize: fontSize.xs,
              }}
              secureTextEntry={true}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
            />
          </Item>
        </Form>
      </View>
      <View style={styles.logInButtonContainer}>
        <Button style={styles.logInButton} rounded onPress={() => {}}>
          <Text
            style={{
              color: 'white',
            }}>
            Log In
          </Text>
        </Button>
      </View>
      <View style={styles.signUpInContainer}>
        <Text style={styles.signUpInText}>
          Don't have an account?{' '}
          <Text onPress={() => navigate('SignUp')} style={styles.signUpText}>
            Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  logInHeaderContainer: {
    paddingLeft: normalize(20),
  },
  logInHeader: {
    fontSize: fontSize.xl,
    color: colors.mainThemeForegroundColor,
    fontWeight: '500',
  },
  inputContainer: {
    marginTop: normalize(40),
    paddingHorizontal: normalize(40),
  },
  logInButtonContainer: {
    paddingHorizontal: normalize(60),
  },
  logInButton: {
    justifyContent: 'center',
    fontSize: fontSize.base,
    fontWeight: '500',
    backgroundColor: colors.mainThemeForegroundColor,
  },
  signUpInContainer: {
    marginTop: normalize(10),
    paddingHorizontal: normalize(62),
  },
  signUpInText: {
    textAlign: 'right',
  },
  signUpText: {
    color: colors.mainThemeForegroundColor,
  },
});
