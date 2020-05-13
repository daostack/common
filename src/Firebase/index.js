import firebase, {utils} from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

module.exports = {
  db: firestore(),
  messaging: messaging(),
  storage: storage(),
  firebase,
  auth,
  utils,
};
