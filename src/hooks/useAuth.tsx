import { useEffect } from 'react';
import { useAppState } from '../store/appState';
import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AppActionType } from '@reducers/appReducer';
import { getSnapshotFromUserAuth } from '@utils/firebase';

export default function useAuth() {
  const { state, dispatch } = useAppState();
  const { auth, isInitializing } = state;

  useEffect(() => {
    async function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
      const userSnapshot = await getSnapshotFromUserAuth(user, {});
      if (!userSnapshot) {
        dispatch({ type: AppActionType.AUTH_CHANGE, auth: null });
        return null;
      }
      dispatch({ type: AppActionType.AUTH_CHANGE, auth: { id: userSnapshot.id, ...userSnapshot.data() } });
    }
    const subscriber = firebaseAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return { auth, isInitializing };
}