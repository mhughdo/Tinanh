import { Platform } from 'react-native';
import storage from '@react-native-firebase/storage';
export * from './firebase';

export const getFileLocalPath = (response) => {
  const { path, uri } = response;
  return Platform.OS === 'android' ? path : uri;
};

export const createStorageReferenceToFile = (fileName: string) => {
  return storage().ref(fileName);
};

export const uploadFileToFireBase = (imagePickerResponse, fileName) => {
  const fileSource = getFileLocalPath(imagePickerResponse);
  const storageRef = createStorageReferenceToFile(fileName);
  return storageRef.putFile(fileSource);
};
