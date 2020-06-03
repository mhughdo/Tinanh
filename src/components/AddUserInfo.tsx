import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { DatePicker, Form, Item, Input, Picker, Button, Spinner, Toast } from 'native-base';
import GoBackHeader from '@shared/GoBackHeader';
import useAuth from '@hooks/useAuth';
import firebaseAuth from '@react-native-firebase/auth';
import { useAppState } from '@store/appState';
import { AppActionType } from '@reducers/appReducer';
import normalize from 'react-native-normalize';
import fontSize from '@constants/fontSize';
import colors from '@constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { db } from '@utils/index';

const AddUserInfo = () => {
  const { auth } = useAuth();
  const { dispatch } = useAppState();
  const [date, setDate] = useState('');
  const [bio, setBio] = useState('');
  const [school, setSchool] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    if (auth) {
      dispatch({ type: AppActionType.AUTH_CHANGE, auth: null });
      firebaseAuth()
        .signOut()
        .then(() => console.log('User signed out!'))
        .catch((error) => console.log('Error logging out', error));
    }
  };

  const handleContinue = async () => {
    if (!date || !bio || !school || !gender) {
      return Toast.show({
        text: 'All fields are required!',
        buttonText: 'Okay',
        type: 'warning',
        duration: 3000,
      });
    }

    setLoading(true);

    if (auth) {
      const userRef = db.doc(`users/${auth.id}`);

      const snapShot = await userRef.get();

      if (!snapShot.exists) {
        Toast.show({
          text: 'User not existed!',
          buttonText: 'Okay',
          type: 'warning',
          duration: 3000,
        });
      } else {
        try {
          const data = {
            bio,
            dob: new Date(date),
            school,
            gender,
            isNewUser: false,
          };
          await userRef.update(data);
          dispatch({ type: AppActionType.AUTH_CHANGE, auth: { ...auth, ...data } });
          setLoading(false);
        } catch (error) {
          setLoading(false);
          Toast.show({
            text: 'Error upading user info!',
            buttonText: 'Okay',
            type: 'warning',
            duration: 3000,
          });
          console.log('Error creating user', error.message);
        }
      }
    }
  };

  return (
    <SafeAreaView>
      <GoBackHeader onPress={goBack} />
      <View style={styles.addInfoHeaderContainer}>
        <Text style={styles.addInfoHeader}>Hi {auth?.displayName},</Text>
        <Text style={styles.addInfoHeader}>Tell us more about yourself</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.datePickerContainer}>
          <DatePicker
            defaultDate={new Date(2000, 1, 1)}
            minimumDate={new Date(1990, 1, 1)}
            maximumDate={new Date()}
            locale={'en'}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={'fade'}
            androidMode={'default'}
            placeHolderText="Date of birth"
            placeHolderTextStyle={{ color: colors.mainTextColor }}
            onDateChange={setDate}
            disabled={false}
          />
        </View>
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
                fontSize: normalize(fontSize.sm),
              }}
              autoCapitalize="none"
              onChangeText={setBio}
              value={bio}
              placeholder="Bio"
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
                fontSize: normalize(fontSize.sm),
              }}
              autoCapitalize="none"
              onChangeText={setSchool}
              value={school}
              placeholder="School"
            />
          </Item>
          <Picker
            mode="dropdown"
            iosIcon={<Ionicons name="ios-arrow-down" />}
            placeholder="Select your gender"
            placeholderStyle={{ color: colors.mainTextColor }}
            placeholderIconColor="#007aff"
            style={{
              width: undefined,
              borderWidth: 1,
              borderColor: colors.grey6,
              borderRadius: 20,
              paddingRight: normalize(10),
            }}
            selectedValue={gender}
            onValueChange={setGender}>
            <Picker.Item label="Women" value="women" />
            <Picker.Item label="Men" value="men" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </Form>
      </View>
      <View style={styles.continueButtonContainer}>
        <Button disabled={loading} style={styles.continueButton} rounded onPress={handleContinue}>
          {loading ? (
            <Spinner color="white" />
          ) : (
            <Text
              style={{
                color: 'white',
              }}>
              Continue
            </Text>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default AddUserInfo;

const styles = StyleSheet.create({
  addInfoHeaderContainer: {
    paddingLeft: normalize(20),
  },
  addInfoHeader: {
    fontSize: normalize(fontSize.xl),
    color: colors.mainThemeForegroundColor,
    fontWeight: '500',
  },
  inputContainer: {
    marginTop: normalize(40),
    paddingHorizontal: normalize(40),
  },
  datePickerContainer: {
    borderWidth: 1,
    borderRadius: 30,
    padding: normalize(3),
    paddingLeft: 10,
    borderColor: colors.grey6,
    marginBottom: normalize(20),
  },
  continueButtonContainer: {
    paddingHorizontal: normalize(50),
    marginTop: normalize(10),
  },
  continueButton: {
    justifyContent: 'center',
    fontSize: normalize(fontSize.base),
    fontWeight: '500',
    backgroundColor: colors.mainThemeForegroundColor,
  },
});
