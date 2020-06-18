import { Platform } from 'react-native';
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
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

function delay(t: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}

export async function getSmallerImage(
  triesRemaining: number,
  bigImgUpdated: string,
  storageRef: FirebaseStorageTypes.Reference,
): Promise<any> {
  if (triesRemaining < 0) {
    return console.log('Out of tries');
  }

  try {
    const smallImgUpdated = (await storageRef.getMetadata()).updated;
    if (bigImgUpdated < smallImgUpdated) {
      return await storageRef.getDownloadURL();
    } else {
      return delay(1000).then(() => {
        return getSmallerImage(triesRemaining - 1, bigImgUpdated, storageRef);
      });
    }
  } catch (error) {
    switch (error.code) {
      case 'storage/object-not-found':
        return delay(1000).then(() => {
          return getSmallerImage(triesRemaining - 1, bigImgUpdated, storageRef);
        });
      default:
        console.log(error);
      // return Promise.reject(error);
    }
  }
}

export const calculateAge = (dob) => {
  const converted = new Date(dob);
  const userYear = converted.getFullYear();
  const thisYear = new Date().getFullYear();

  return thisYear - userYear;
};

export const randNum = (min = 1, max = 20) => {
  return Math.floor(Math.random() * max) + min;
};
