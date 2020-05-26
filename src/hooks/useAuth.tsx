import { useEffect } from 'react';
import { useAppState } from '../store/appState';
import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AppActionType } from '../reducers/appReducer';

export default function useAuth() {
  const { state, dispatch } = useAppState();
  const { auth, isInitializing } = state;

  useEffect(() => {
    function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
      dispatch({ type: AppActionType.AUTH_CHANGE, auth: user });
    }

    const subscriber = firebaseAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return { auth, isInitializing };
}
