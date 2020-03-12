const firebase = require('firebase');
require('firebase/firestore');
const RNfirebase = require('react-native-firebase');

// const {firebaseConfig} = require('../../../env');

const firebaseConfig = {
  apiKey: "AIzaSyAml-zMhoG_amLvM8mTxrydDOYXTGuubsA",
  authDomain: "common-daostack.firebaseapp.com",
  databaseURL: "https://common-daostack.firebaseio.com",
  projectId: "common-daostack",
  storageBucket: "common-daostack.appspot.com",
  messagingSenderId: "854172758045",
  appId: "1:854172758045:web:62638a16861d87121e96f4",
  measurementId: "G-5G489M0VPG"
};

firebase.initializeApp(firebaseConfig);

module.exports = {
  db: firebase.firestore(),
  messaging: RNfirebase.messaging(),
  firebase
};
