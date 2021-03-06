import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const db = firestore();

export { FirebaseFirestoreTypes };

export const createUserProfileDocument = async (userAuth, additionalData, createIfNotExisted) => {
  if (!userAuth) {
    return;
  }

  const userRef = db.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists && createIfNotExisted) {
    const { displayName, email, uid } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set(
        {
          id: uid,
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

export const getSnapshotFromUserAuth = async (userAuth, additionalData, createIfNotExisted = false) => {
  const userRef = await createUserProfileDocument(userAuth, additionalData, createIfNotExisted);
  if (!userRef) {
    return null;
  }
  const userSnapshot = await userRef.get();

  return userSnapshot;
};
