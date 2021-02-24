import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import Toast from '~/Util/Toast';
import {db} from '~/Firebase';
import logger from './Logger';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';

export default class NotificationService {
  static async saveTokenToDatabase() {
    if (auth().currentUser === null) {
      return;
    }
    const userId = auth().currentUser.uid;
    const token = await messaging().getToken();
    await db
      .collection('users')
      .doc(userId)
      .update({
        tokens: firestore.FieldValue.arrayUnion(token),
      })
      // .then(() => {
      //   logger.log('FCM token updated');
      // })
      .catch((err) => logger.log(err));
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
      logger.log('Permission settings:', settings);
    }
  }

  static async getNotificationList() {
    const userId = auth().currentUser.uid;

    //Index creation doesn't work but is created already
    return (
      db
        .collection(DB_COLLECTIONS.event)
        .where('userId', '==', userId)
        // .orderBy('createdAt', 'desc')
        .get()
        .then((snapshots) => {
          if (!snapshots) {
            return null;
          }
          return snapshots.docs.map((doc) => doc.data());
        })
        .catch((error) => console.log(error))
    );
  }

  static async listenTransaction(txHash) {
    if (auth().currentUser === null) {
      return;
    }
    const userId = auth().currentUser.uid;

    db.collection('users')
      .doc(userId)
      .update({
        transactionHistory: firestore.FieldValue.arrayUnion(txHash),
      })
      .catch((err) => logger.log(err));
  }

  static async follow(targetUid) {
    if (auth().currentUser === null) {
      return;
    }
    const userId = auth().currentUser.uid;
    if (targetUid === userId) {
      Toast.error('Can not follow yourself');
    }
    logger.log('Follow', userId, targetUid);

    db.collection('users')
      .doc(userId)
      .update({
        following: firestore.FieldValue.arrayUnion(targetUid),
      })
      .then(() => {
        logger.log('updated');
        // Toast.done('Follow success');
      })
      .catch((err) => logger.log(err));
  }

  static async unfollow(targetUid) {
    if (auth().currentUser === null) {
      return;
    }
    const userId = auth().currentUser.uid;
    if (targetUid === userId) {
      Toast.error('Can not follow yourself');
    }
    logger.log('Unfollow', userId, targetUid);

    db.collection('users')
      .doc(userId)
      .update({
        following: firestore.FieldValue.arrayRemove(targetUid),
      })
      .then(() => {
        logger.log('updated');
        // Toast.done('Follow success');
      })
      .catch((err) => logger.log(err));
  }
}
