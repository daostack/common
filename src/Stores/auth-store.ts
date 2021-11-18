import appleAuth from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import {fromResource} from 'mobx-utils';
import {statusCodes} from '@react-native-google-signin/google-signin';
import {flow, makeAutoObservable} from 'mobx';
import {googleSignIn, appleSignIn, signOut} from '~/Firebase';
import Logger from '~/Services/logger';
import {UserModel} from './Models';

export function createUserObservable() {
  let authUnsubscribe!: () => void;
  let userUnsubscribe: () => void;
  return fromResource<UserModel | null>(
    (sink) => {
      // subscribe to the record, invoke the sink callback whenever new data arrives
      authUnsubscribe = auth().onAuthStateChanged((user) => {
        if (user) {
          const document = new UserModel(`users/${user.uid}`);
          sink(document);
        } else {
          sink(null);
        }
      });
    },
    () => {
      if (authUnsubscribe) {
        authUnsubscribe();
        if (userUnsubscribe) {
          userUnsubscribe();
        }
      }
    },
  );
}

export class AuthStore {
  user = createUserObservable();
  authenticating: boolean = false;
  error: string | null = null;
  signingOut: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }

  get uid() {
    return this.user.current()?.uid;
  }
  get signedInUser(): boolean {
    return !!this.user.current();
  }

  setError(code: string) {
    switch (code) {
      case statusCodes.SIGN_IN_CANCELLED:
        this.error = 'Canceled';
        break;
      case statusCodes.IN_PROGRESS:
        Logger.log('SignIn in progress');
        break;
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        this.error = 'play services not available or outdated';
        break;
      case appleAuth.Error.CANCELED:
        this.error = 'Canceled';
        break;
      case appleAuth.Error.FAILED:
        this.error = 'Failed';
        break;
      case appleAuth.Error.INVALID_RESPONSE:
        this.error = 'Invalid response';
        break;
      case appleAuth.Error.NOT_HANDLED:
        this.error = 'Not handled';
        break;
      case appleAuth.Error.UNKNOWN:
        this.error = 'Unknown error';
        break;

      default:
        this.error = code;
    }
  }

  googleSignIn = flow(function* (this: AuthStore) {
    if (this.authenticating) {
      return;
    }
    this.authenticating = true;
    this.error = null;
    try {
      // That loading status will be changed to false in the onAuthStateChanged method in App.js
      yield googleSignIn();
    } catch (error) {
      this.setError(error.code as string);
    } finally {
      this.authenticating = false;
    }
  });

  appleSignIn = flow(function* (this: AuthStore) {
    if (this.authenticating) {
      return;
    }
    this.authenticating = true;
    this.error = null;

    try {
      yield appleSignIn();
    } catch (error) {
      this.setError(error.code as string);
    } finally {
      this.authenticating = false;
    }
  });

  isAppleLoginSupported() {
    return appleAuth.isSupported;
  }

  signOut = flow(function* (this: AuthStore) {
    try {
      this.signingOut = true;
      yield signOut();
    } catch (error) {
      Logger.log('SignOut Error -> ', error);
    }
    this.signingOut = false;
  });
}
