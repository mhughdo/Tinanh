import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { InitialStateType, AppActionTypes } from '../reducers/appReducer';

const initialState = {
  isInitializing: true,
  isSignout: false,
  userToken: null,
  auth: null,
};

const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<AppActionTypes>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function AppStateProvider({ reducer, children }) {
  const [state, dispatch] = useReducer(reducer, initialState) as [InitialStateType, Dispatch<AppActionTypes>];

  return <AppContext.Provider value={{ state, dispatch }} children={children} />;
}

export function useAppState() {
  return useContext(AppContext);
}
