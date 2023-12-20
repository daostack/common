import {NativeModules} from 'react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
jest.mock('react-native-intercom', () => jest.fn());

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-share', () => ({
  default: jest.fn(),
}));

jest.mock('react-native-blob-util', () => ({
  fs: {
    dirs: {
      CacheDir: './',
    },
    unlink: jest.fn(),
  },
  MediaCollection: {
    copyToInternal: jest.fn(),
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

NativeModules.RNDocumentPicker = {
  pick: jest.fn(),
  types: {
    allFiles: '*',
    pdf: '.pdf',
  },
  isCancel: jest.fn(),
};

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
