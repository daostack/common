import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import Toast from '~/Util/Toast';
import {db} from '~/Firebase';
import logger from './Logger';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {
  EventTypesOnNotificationList,
  EventTypeState,
} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {fetchCommonById} from './ListServices/CommonListService';
import {fetchProposalById} from './ListServices/ProposalListService';
import {fetchMessageById} from './ListServices/DiscussionMessageListService';
import {fetchDiscussionId} from './ListServices/DiscussionListService';
import {getUserById} from './ListServices/UserListService';

export const TODELETE = 'To Delete';

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
      .where('userFilter', 'array-contains', userId)
      .where('eventType', 'in', EventTypesOnNotificationList)
      .get()
      .then(async (snapshots) => {
        if (!snapshots) {
          return null;
        }

        const resultFormatted = await Promise.all(
          snapshots.docs.map(async (doc) => {
            let data = {...doc.data(), id: doc.id};

            let common;
            let proposal;
            let user;
            let dataProperlyLoaded = false;

            if (data.eventObjectId) {
              switch (data.eventType) {
                case EventTypeState.commonWhitelisted:
                  common = await fetchCommonById(data.eventObjectId);
                  if (common) {
                    user = await getUserById(common.members[0].userId);
                    if (user) {
                      data = {
                        ...data,
                        descriptionBold: `"${common.name}"`,
                        description: ' - You might want to check it out.',
                        ownerAvatar: user.photoURL,
                        common,
                      };
                      dataProperlyLoaded = true;
                    }
                  }

                  break;

                case EventTypeState.fundingRequestCreated:
                case EventTypeState.fundingRequestAccepted:
                case EventTypeState.fundingRequestExecuted:
                case EventTypeState.fundingRequestRejected:
                  proposal = await fetchProposalById(data.eventObjectId);
                  if (proposal) {
                    common = await fetchCommonById(proposal.commonId);
                    user = proposal.user;
                    if (common && user) {
                      data = {
                        ...data,
                        descriptionBold: `"${proposal.description.title}"`,
                        description: ` (${
                          proposal.fundingRequest.amount / 100
                        }$ requested)`,
                        commonName: common.name,
                        ownerAvatar: user.photoURL,
                        proposal,
                      };

                      if (
                        data.eventType === EventTypeState.fundingRequestCreated
                      ) {
                        data = {
                          ...data,
                          header: ' by',
                          headerBold: `${user.firstName} ${user.lastName}`,
                        };
                      }
                      dataProperlyLoaded = true;
                    }
                  }

                  break;

                case EventTypeState.messageCreated:
                  const message = await fetchMessageById(data.eventObjectId);
                  if (message) {
                    const discussion = await fetchDiscussionId(
                      message.discussionId,
                    );
                    user = await getUserById(message.ownerId);

                    if (user) {
                      data = {
                        ...data,
                        descriptionBold: `${user.firstName} ${user.lastName}`,
                        description: ` ${message.text}`,
                        ownerAvatar: user.photoURL,
                        discussion: {...discussion, id: message.discussionId},
                      };

                      if (discussion && discussion.commonId) {
                        common = await fetchCommonById(discussion.commonId);

                        if (common && common.name) {
                          data = {
                            ...data,
                            header: ' on',
                            headerBold: `${discussion.title}`,
                            commonName: common.name,
                            commonId: discussion.commonId,
                          };
                          dataProperlyLoaded = true;
                        }
                      }
                    }
                  }

                  break;

                case EventTypeState.requestToJoinAccepted:
                  proposal = await fetchProposalById(data.eventObjectId);
                  if (proposal) {
                    common = await fetchCommonById(proposal.commonId);
                    user = proposal.user;

                    if (common && user) {
                      data = {
                        ...data,
                        description: ' Congrats! You are now a member!',
                        ownerAvatar: user.photoURL,
                        commonName: common.name,
                        proposal,
                      };
                      dataProperlyLoaded = true;
                    }
                  }

                  break;

                case EventTypeState.requestToJoinCreated:
                  proposal = await fetchProposalById(data.eventObjectId);
                  if (proposal) {
                    common = await fetchCommonById(proposal.commonId);
                    user = proposal.user;

                    if (common && user) {
                      data = {
                        ...data,
                        description:
                          ' Your Common has new pending members, view their requests and vote',
                        ownerAvatar: user.photoURL,
                        commonName: common.name,
                        proposal,
                      };
                      dataProperlyLoaded = true;
                    }
                  }

                  break;

                case EventTypeState.requestToJoinRejected:
                  proposal = await fetchProposalById(data.eventObjectId);
                  if (proposal) {
                    common = await fetchCommonById(proposal.commonId);
                    user = proposal.user;

                    if (common && user) {
                      data = {
                        ...data,
                        description:
                          " Don't give up, there are plenty of other Commons you can join.",
                        ownerAvatar: user.photoURL,
                        commonName: common.name,
                        proposal,
                      };
                      dataProperlyLoaded = true;
                    }
                  }
                  break;
              }
            }

            if (dataProperlyLoaded) {
              return data;
            } else {
              return TODELETE;
            }
          }),
        );

        const welcomeNotification = await this.addWelcomeNotification();

        resultFormatted.push(welcomeNotification);

        return resultFormatted.filter((item) => item !== TODELETE);
      })
      .catch((error) => console.log(error));
  }

  static async addWelcomeNotification() {
    const userId = auth().currentUser.uid;
    const user = await getUserById(userId);

    const data = {
      id: EventTypeState.welcomeNotification,
      descriptionBold: "We're excited to have you with us",
      description: ' Looking for the first Common to join? Browse now.',
      ownerAvatar:
        'https://firebasestorage.googleapis.com/v0/b/common-staging-50741.appspot.com/o/public_img%2FappLogo.png?alt=media&token=41fec685-b6fb-4b56-813a-fd3e8756787a',
      createdAt: user.createdAt,
      eventType: EventTypeState.welcomeNotification,
    };

    return data;
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
