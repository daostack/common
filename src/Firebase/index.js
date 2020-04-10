import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const {firebaseConfig} = require('../../env');

firebase.initializeApp(firebaseConfig);

module.exports = {
  db: firestore,
  messaging: messaging,
  firebase,
};
