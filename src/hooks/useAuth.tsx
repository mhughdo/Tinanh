import { useEffect } from 'react';
import { useAppState } from '../store/appState';
import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AppActionType } from '@reducers/appReducer';
import { getSnapshotFromUserAuth, calculateAge, db, FirebaseFirestoreTypes } from '@utils/index';

export default function useAuth() {
  const { state, dispatch } = useAppState();
  const { auth, isInitializing } = state;

  useEffect(() => {
    async function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
      const userSnapshot = await getSnapshotFromUserAuth(user, {});
      if (!userSnapshot) {
        dispatch({ type: AppActionType.AUTH_CHANGE, auth: null });
        return null;
      } else if (userSnapshot.data()) {
        const age = userSnapshot.data()?.dob ? calculateAge(userSnapshot.data().dob.toDate()) : null;
        dispatch({
          type: AppActionType.AUTH_CHANGE,
          auth: { id: userSnapshot.id, ...userSnapshot.data(), age: age },
        });
      }
    }
    const subscriber = firebaseAuth().onAuthStateChanged(onAuthStateChanged);

    const unsubscribe = db
      .doc(`users/${auth?.id}`)
      .onSnapshot(async (userSnapshot: FirebaseFirestoreTypes.DocumentSnapshot) => {
        console.log(userSnapshot.data());
        const age = userSnapshot.data()?.dob ? calculateAge(userSnapshot?.data()?.dob?.toDate()) : null;
        dispatch({
          type: AppActionType.AUTH_CHANGE,
          auth: { id: userSnapshot.id, ...userSnapshot.data(), age: age },
        });
      });
    return () => {
      unsubscribe();
      subscriber();
    }; // unsubscribe on unmount
  }, []);

  return { auth, isInitializing };
}
