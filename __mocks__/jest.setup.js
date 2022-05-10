import {NativeModules} from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('rn-fetch-blob', () => ({
  fs: {
    dirs: {
      CacheDir: './',
    },
    unlink: jest.fn(),
  },
  config: () => ({
    fetch: jest.fn(),
  }),
}));
jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);
jest.mock('react-native-text-input-mask', () => () => null);
jest.mock('@invertase/react-native-apple-authentication', () => jest.fn());

jest.mock('@react-native-firebase/app', () => ({}));
jest.mock('@react-native-firebase/storage', () => jest.fn());
jest.mock('@react-native-firebase/auth', () =>
  jest.fn().mockReturnValue({
    onAuthStateChanged: jest.fn(),
  }),
);
jest.mock('@react-native-firebase/firestore', () =>
  jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          doc: jest.fn().mockReturnValue({
            collection: jest.fn().mockReturnValue({
              doc: jest.fn().mockReturnValue({
                set: jest.fn(),
                get: jest.fn(),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
);
jest.mock('@react-native-firebase/messaging', () => jest.fn());

jest.mock('../src/Services/Logger.ts', () => jest.fn());

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn(),
  getCountry: jest.fn(),
}));

jest.mock('react-native-fbsdk-next', () => ({
  Settings: {setAppID: jest.fn()},
}));

jest.mock('react-native-config', () => ({
  ENV: 'staging',
}));

jest.mock('@react-native-community/google-signin', () => {
  const mockGoogleSignin = jest.requireActual(
    '@react-native-community/google-signin',
  );

  mockGoogleSignin.GoogleSignin.hasPlayServices = () => Promise.resolve(true);
  mockGoogleSignin.GoogleSignin.configure = () => Promise.resolve();
  mockGoogleSignin.GoogleSignin.currentUserAsync = () => {
    return Promise.resolve({
      name: 'name',
      email: 'test@example.com',
      // .... other user data
    });
  };

  // ... and other functions you want to mock

  return mockGoogleSignin;
});

NativeModules.RNGoogleSignin = {
  BUTTON_SIZE_ICON: 0,
  BUTTON_SIZE_STANDARD: 0,
  BUTTON_SIZE_WIDE: 0,
  BUTTON_COLOR_AUTO: 0,
  BUTTON_COLOR_LIGHT: 0,
  BUTTON_COLOR_DARK: 0,
  SIGN_IN_CANCELLED: '0',
  IN_PROGRESS: '1',
  PLAY_SERVICES_NOT_AVAILABLE: '2',
  SIGN_IN_REQUIRED: '3',
  configure: jest.fn(),
  currentUserAsync: jest.fn(),
};

export {NativeModules};
