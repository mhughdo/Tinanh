export type userType = {
  id: string;
  displayName: string;
  email: string;
  avatarURL: string;
  photos: string[];
  liked: string[];
  disliked: string[];
  isLiked: { id: string; isSuperLike: boolean }[];
  matches: string[];
  settings: {
    maxDistance: number;
    gender: string;
    minAge: number;
    maxAge: number;
  };
  messages: { messageBoxID: string; userIDs: string[] }[];
  bio: string;
  age: number;
  school: string;
  work: string;
  isNewUser: boolean;
};

export enum AppActionType {
  RESTORE_TOKEN = 'RESTORE_TOKEN',
  AUTH_CHANGE = 'AUTH_CHANGE',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
}

export type InitialStateType = {
  isInitializing: boolean;
  isSignout: boolean;
  userToken: null;
  auth: userType | null;
};

export type AppActionTypes =
  | { type: AppActionType.RESTORE_TOKEN; token: string | null | undefined }
  | { type: AppActionType.AUTH_CHANGE; auth: {} | null }
  | { type: AppActionType.SIGN_IN; token: string | null | undefined; auth: Partial<userType> | null }
  | { type: AppActionType.SIGN_OUT; token: string | null | undefined; auth: Partial<userType> | null };

export const appStateReducer = (state: InitialStateType, action: AppActionTypes) => {
  // TODO edit RESTORE_TOKEN and AUTH_CHANGE action

  switch (action.type) {
    case AppActionType.RESTORE_TOKEN:
      return {
        ...state,
        userToken: action.token,
        isInitializing: false,
      };
    case AppActionType.AUTH_CHANGE:
      return {
        ...state,
        auth: action.auth,
        isInitializing: false,
      };
    case AppActionType.SIGN_IN:
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
        auth: action.auth,
      };
    case AppActionType.SIGN_OUT:
      return {
        ...state,
        isSignout: true,
        userToken: '',
        auth: null,
      };
    default:
      throw new Error('Unknown action');
  }
};
