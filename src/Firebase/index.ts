import Config from 'react-native-config';

import firebaseApp, {utils as firebaseUtils} from '@react-native-firebase/app';
import firebaseMessaging from '@react-native-firebase/messaging';
import firebaseStorage from '@react-native-firebase/storage';
import firebaseAuth from '@react-native-firebase/auth';

import '@react-native-firebase/app';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import logger from '../Services/Logger';

export const db = firestore();

if (Config.local === 'true' && __DEV__) {
  logger.warn('Using local firestore');

  db.settings({
    host: 'localhost:8080',
    ssl: false,
    persistence: false, // Disabled offline mode for local environment
  });
}

export const auth = firebaseAuth;
export const messaging = firebaseMessaging();
export const storage = firebaseStorage();
export const firebase = firebaseApp;
export const utils = firebaseUtils;
export type Timestamp = FirebaseFirestoreTypes.Timestamp;
export const {
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} = firestore.FieldValue;
export type CollectionReference = FirebaseFirestoreTypes.CollectionReference;

export * from './auth';
export * from './Database';
