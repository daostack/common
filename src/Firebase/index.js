import Config from 'react-native-config';

import firebase, {utils} from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';


const db = firestore();

if (Config.local === 'true') {
  console.warn('Using local firestore');

  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });
}

module.exports = {
  messaging: messaging(),
  storage: storage(),
  firebase,
  utils,
  auth,
  db,
};
