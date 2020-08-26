import firebase, {utils} from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

const db = firestore();

db.settings({ host: 'localhost:8082', ssl: false });

console.log('--- firestore ---');

let isLocalPort = false;

if (__DEV__) {
  axios.get('http://localhost:8082')
    .then(response => {
      isLocalPort = true;
    });
}
// db.settings({ host: 'http://localhost:8080' });

const getFirestore = () => {
  if (isLocalPort) {
    db.settings({ host: 'localhost:8082', ssl: false });
    console.log(' --- Set firestore ---');
  }
  return db;
};

module.exports = {
  db: getFirestore(),
  messaging: messaging(),
  storage: storage(),
  firebase,
  auth,
  utils,
};
