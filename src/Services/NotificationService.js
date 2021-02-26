import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import Toast from '~/Util/Toast';
import {db} from '~/Firebase';
import logger from './Logger';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {EventTypeState} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {getCommonById} from './ListServices/CommonListService';
import {getProposalById} from './ListServices/ProposalListService';
import {getMessageById} from './ListServices/DiscussionMessageListService';
import {getDiscussionId} from './ListServices/DiscussionListService';
import {getUserById} from './ListServices/UserListService';

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

    return db
      .collection(DB_COLLECTIONS.notification)
      .orderBy('createdAt', 'desc')
      .get()
      .then(async (snapshots) => {
        if (!snapshots) {
          return null;
        }

        const result = snapshots.docs.filter(
          (s) =>
            s.data().userFilter?.includes(userId) &&
            (s.data().eventType === EventTypeState.commonWhitelisted ||
              s.data().eventType === EventTypeState.commonCreated ||
              s.data().eventType === EventTypeState.fundingRequestCreated ||
              s.data().eventType === EventTypeState.fundingRequestAccepted ||
              s.data().eventType === EventTypeState.fundingRequestExecuted ||
              s.data().eventType === EventTypeState.fundingRequestRejected ||
              s.data().eventType === EventTypeState.messageCreated ||
              s.data().eventType === EventTypeState.requestToJoinAccepted ||
              s.data().eventType === EventTypeState.requestToJoinCreated ||
              s.data().eventType === EventTypeState.requestToJoinRejected),
        );

        const resultFormatted = await Promise.all(
          result.map(async (doc) => {
            let data = doc.data();

            if (data.eventObjectId) {
              if (
                data.eventType === EventTypeState.commonWhitelisted ||
                data.eventType === EventTypeState.commonCreated
              ) {
                const common = await getCommonById(data.eventObjectId);
                const user = await getUserById(common.members[0].userId);

                data = {
                  ...data,
                  descriptionBold: `"${common.name}"`,
                  description: ' - You might want to check it out.',
                  ownerAvatar: user.photoURL,
                  common,
                };
              } else if (
                data.eventType === EventTypeState.fundingRequestCreated ||
                data.eventType === EventTypeState.fundingRequestAccepted ||
                data.eventType === EventTypeState.fundingRequestExecuted ||
                data.eventType === EventTypeState.fundingRequestRejected
              ) {
                const proposal = await getProposalById(data.eventObjectId);
                const user = await getUserById(proposal.proposerId);

                data = {
                  ...data,
                  descriptionBold: `"${proposal.description.title}"`,
                  description: ` (${proposal.fundingRequest.amount}$ requested)`,
                  ownerAvatar: user.photoURL,
                  proposal,
                };

                if (data.eventType === EventTypeState.fundingRequestCreated) {
                  data = {
                    ...data,
                    header: ' by',
                    headerBold: ` "${user.displayName}"`,
                  };
                }
              } else if (data.eventType === EventTypeState.messageCreated) {
                const message = await getMessageById(data.eventObjectId);
                const discussion = await getDiscussionId(message.discussionId);

                data = {
                  ...data,
                  descriptionBold: `${message.ownerName}`,
                  description: ` ${message.text}`,
                  ownerAvatar: message.ownerAvatar,
                  discussion,
                };

                if (discussion && discussion.commonId) {
                  const common = await getCommonById(discussion.commonId);

                  if (common && common.name) {
                    data = {
                      ...data,
                      header: ' on',
                      headerBold: ` "${common.name}"`,
                    };
                  }
                }
              } else if (
                data.eventType === EventTypeState.requestToJoinAccepted
              ) {
                const proposal = await getProposalById(data.eventObjectId);
                const user = await getUserById(proposal.proposerId);

                data = {
                  ...data,
                  description: ` Congrats! You are now a member!`,
                  ownerAvatar: user.photoURL,
                  proposal,
                };
              } else if (
                data.eventType === EventTypeState.requestToJoinCreated
              ) {
                const proposal = await getProposalById(data.eventObjectId);
                const user = await getUserById(proposal.proposerId);

                data = {
                  ...data,
                  description: ` You are asking to be a common member`,
                  ownerAvatar: user.photoURL,
                  proposal,
                };
              } else if (
                data.eventType === EventTypeState.requestToJoinRejected
              ) {
                const proposal = await getProposalById(data.eventObjectId);
                const user = await getUserById(proposal.proposerId);

                data = {
                  ...data,
                  description: ` Don't give up, there are plenty of other Commons you can join.`,
                  ownerAvatar: user.photoURL,
                  proposal,
                };
              }
            }

            return data;
          }),
        );

        return resultFormatted;
      })
      .catch((error) => console.log(error));
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
