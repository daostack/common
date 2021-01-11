import Config from 'react-native-config';

import firebase, {utils} from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import logger from '../Services/Logger';

const db = firestore();
const appFirebase = firebase;

if (Config.local === 'true' && __DEV__) {
  logger.warn('Using local firestore');

  db.settings({
    host: 'localhost:8080',
    ssl: false,
    persistence: false, // Disabled offline mode for local environment
  });
}

module.exports = {
  messaging: messaging(),
  storage: storage(),
  firebase: appFirebase,
  utils,
  auth,
  db,
};
