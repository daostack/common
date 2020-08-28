import firebase, {utils} from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const db = firestore();
const useLocalFirestore = true;

if (useLocalFirestore) {
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });
}

console.log(db)

module.exports = {
  messaging: messaging(),
  storage: storage(),
  firebase,
  utils,
  auth,
  db,
};
