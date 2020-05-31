import React, { useReducer, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import DefaultAvatar from '@images/default-avatar';
import normalize from 'react-native-normalize';
import useAuth from '@hooks/useAuth';
import fontSize from '@constants/fontSize';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '@constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button, Text, Toast, Spinner } from 'native-base';
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import firebaseAuth from '@react-native-firebase/auth';
import { useAppState } from '@store/appState';
import { AppActionType } from '@reducers/appReducer';
import ImagePicker from 'react-native-image-picker';
import { uploadFileToFireBase, getSmallerImage } from '@utils/index';
import { useNavigation } from '@react-navigation/native';

// TODO add cache
type ImagesType = {
  [key: number]: {
    uri: string;
    loading: boolean;
  };
};

const initialState = Array.from({ length: 6 }).reduce((acc: any, value, idx) => {
  return { ...acc, [idx]: { loading: true } };
}, {}) as ImagesType;

type ImageActionsType =
  | { type: 'ADD_IMAGE'; idx: number; loading: boolean; uri: string }
  | { type: 'ADD_ALL_IMAGES'; images: ImagesType };

const imageSize = 400;

const imagesReducer = (state: ImagesType, action: ImageActionsType) => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return { ...state, [action.idx]: { loading: action.loading, uri: action.uri } };
    case 'ADD_ALL_IMAGES':
      return { ...state, ...action.images };
    default:
      throw new Error('Unknown action');
  }
};

const ProfileScreen = () => {
  const [images, imageDispatch] = useReducer(imagesReducer, initialState);
  const { auth } = useAuth();
  const displayName = auth?.displayName || '';
  const { dispatch } = useAppState();
  const navigation = useNavigation();

  useEffect(() => {
    function getImages() {
      const firebaseImages: ImagesType = {};
      function listFilesAndDirectories(reference: FirebaseStorageTypes.Reference, pageToken?: string): any {
        return reference.list({ pageToken }).then(async (result) => {
          // Loop over each item
          for (const ref of result.items) {
            const suffix = `_${imageSize}x${imageSize}`;
            if (ref.name.includes(suffix)) {
              const downloadURL = await ref.getDownloadURL();
              const idx = Number(ref.name.replace(suffix, '').split('-')[1]);
              firebaseImages[idx] = { loading: false, uri: downloadURL };
            }
          }

          if (result.nextPageToken) {
            return listFilesAndDirectories(reference, result.nextPageToken);
          }

          return Promise.resolve();
        });
      }

      const reference = storage().ref(`${auth?.id}`);

      listFilesAndDirectories(reference).then(() => {
        imageDispatch({ type: 'ADD_ALL_IMAGES', images: firebaseImages });
      });
    }
    getImages();
  }, [auth]);

  const monitorFileUpload = (task: FirebaseStorageTypes.Task, idx: number) => {
    task.on(
      storage.TaskEvent.STATE_CHANGED,
      async (snapshot) => {
        if (snapshot.state === storage.TaskState.SUCCESS) {
          console.log('Image uploaded to the bucket');
          const imageName = snapshot.ref.name;
          const updated = snapshot.metadata.updated;
          const smallImageRef = storage().ref(`${auth?.id}/${imageName}_${imageSize}x${imageSize}`);
          const smallURL = await getSmallerImage(5, updated, smallImageRef);
          const uri = smallURL || (await snapshot.ref.getDownloadURL());
          console.log(smallURL, imageName);
          imageDispatch({ type: 'ADD_IMAGE', idx, uri, loading: false });
        }
      },
      () => {
        return Toast.show({
          text: 'Error uploading image!',
          buttonText: 'Okay',
          type: 'danger',
          duration: 3000,
        });
      },
    );
  };

  const uploadFile = (idx: number) => {
    ImagePicker.launchImageLibrary({ noData: true }, async (response) => {
      if (response.didCancel) {
        console.log('Post canceled');
      } else if (response.error) {
        console.log('An error occurred: ', response.error);
      } else {
        imageDispatch({ type: 'ADD_IMAGE', idx, uri: response.uri, loading: true });
        const task = uploadFileToFireBase(response, `${auth?.id}/${auth?.displayName.replace(/[\s\W]+/g, '')}-${idx}`);
        monitorFileUpload(task, idx);
      }
    });
  };

  const logOut = () => {
    if (auth) {
      dispatch({ type: AppActionType.AUTH_CHANGE, auth: null });
      firebaseAuth()
        .signOut()
        .then(() => console.log('User signed out!'))
        .catch((error) => console.log('Error logging out', error));
    }
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.avatarContainer}>
        <DefaultAvatar height={normalize(150)} width={normalize(150)} />
      </View>
      <Text style={styles.userName}>{displayName}</Text>
      <View style={styles.photosContainer}>
        <Text style={{ fontSize: fontSize.base }}>My photos</Text>
        <View style={styles.photos}>
          {Array.from({ length: 6 }).map((_, idx) => {
            const image = images[idx];

            return (
              <TouchableOpacity onPress={() => uploadFile(idx)} style={styles.photo}>
                {image ? (
                  image.loading ? (
                    <Spinner color="#ffffff" />
                  ) : (
                    <Image
                      style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, resizeMode: 'cover' }}
                      source={image}
                    />
                  )
                ) : (
                  <Entypo name="camera" color="white" size={normalize(30)} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.settingsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('AccountDetailsScreen')} style={styles.settingContainer}>
          <FontAwesome5 name="user-circle" size={23} color={Colors.indigo500} />
          <Text style={{ marginLeft: normalize(15) }}>Account Details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')} style={styles.settingContainer}>
          <AntDesign name="setting" size={23} />
          <Text style={{ marginLeft: normalize(15) }}>Settings</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logOutButtonContainer}>
        <Button onPress={logOut} style={styles.logOutButton} bordered>
          <Text style={styles.logOutText}>Logout</Text>
        </Button>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileContainer: {
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: normalize(20),
  },
  userName: {
    marginTop: normalize(10),
    textAlign: 'center',
    fontSize: normalize(fontSize.lg),
    fontWeight: '500',
  },
  photosContainer: {
    paddingHorizontal: normalize(10),
  },
  photos: {
    flexDirection: 'row',
    marginTop: normalize(10),
    width: '100%',
    flexWrap: 'wrap',
  },
  photo: {
    height: normalize(70),
    marginRight: normalize(10),
    marginBottom: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '23%',
    overflow: 'hidden',
    backgroundColor: Colors.mainThemeForegroundColor,
  },
  settingsContainer: {
    marginTop: normalize(20),
    paddingHorizontal: normalize(30),
  },
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  logOutButtonContainer: {
    paddingHorizontal: normalize(10),
    marginTop: normalize(20),
  },
  logOutButton: {
    borderColor: Colors.grey9,
    justifyContent: 'center',
    borderRadius: 10,
  },
  logOutText: {
    textAlign: 'center',
    color: Colors.mainTextColor,
  },
});
