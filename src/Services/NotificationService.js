import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import Toast from '../Util/Toast';

export default class NotificationService {
  static async saveTokenToDatabase() {
    const userId = auth().currentUser.uid;
    const token = await messaging().getToken();
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        tokens: firestore.FieldValue.arrayUnion(token),
      })
      .then(() => {
        console.log('FCM token updated');
      })
      .catch(err => console.log(err));
  }

  async getToken() {
    return messaging().getToken();
  }

  async registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }

  async requestUserPermission() {
    const settings = await messaging().requestPermission();

    // NOT_DETERMINED = -1,
    // DENIED = 0,
    // AUTHORIZED = 1,
    // PROVISIONAL = 2,

    if (settings) {
      console.log('Permission settings:', settings);
    }
  }

  static async listenTransaction(txHash) {
    const userId = auth().currentUser.uid;
    firestore()
      .collection('users')
      .doc(userId)
      .update({
        transactionHistory: firestore.FieldValue.arrayUnion(txHash),
      })
      .then(() => {
        console.log('updated');
      })
      .catch(err => console.log(err));
  }

  static async follow(targetUid) {
    const userId = auth().currentUser.uid;
    if (targetUid === userId) {
      Toast.error('Can not follow yourself');
    }
    console.log('Follow', userId, targetUid);
    firestore()
      .collection('users')
      .doc(userId)
      .update({
        following: firestore.FieldValue.arrayUnion(targetUid),
      })
      .then(() => {
        console.log('updated');
        // Toast.done('Follow success');
      })
      .catch(err => console.log(err));
  }

  static async unfollow(targetUid) {
    const userId = auth().currentUser.uid;
    if (targetUid === userId) {
      Toast.error('Can not follow yourself');
    }
    console.log('Unfollow', userId, targetUid);
    firestore()
      .collection('users')
      .doc(userId)
      .update({
        following: firestore.FieldValue.arrayRemove(targetUid),
      })
      .then(() => {
        console.log('updated');
        // Toast.done('Follow success');
      })
      .catch(err => console.log(err));
  }
}
