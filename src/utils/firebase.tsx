import firestore from '@react-native-firebase/firestore';

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) {
    return;
  }

  const userRef = firestore().doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set(
        {
          displayName,
          email,
          createdAt,
          ...additionalData,
        },
        { merge: true },
      );
    } catch (error) {
      console.log('Error creating user', error.message);
    }
  }
  return userRef;
};

export const getSnapshotFromUserAuth = async (userAuth, additionalData) => {
  const userRef = await createUserProfileDocument(userAuth, additionalData);
  if (!userRef) {
    return null;
  }
  const userSnapshot = await userRef.get();

  return userSnapshot;
};
