import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {db} from '~/Firebase';
import axios from 'axios';
import {discussionsUrl} from '~/Config';
import logger from './Logger';
import {auth} from '~/Firebase';

export default class DiscussionService {
  static serviceInstance = null;

  constructor() {

    this.axiosClient = axios.create({
      baseURL: discussionsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      update: '/update',
    };
  }

  static getInstance = () => {
    if (DiscussionService.serviceInstance == null) {
      DiscussionService.serviceInstance = new DiscussionService();
    }
    return this.serviceInstance;
  };

  async getDiscussionInfo(discussionId) {
    return db
      .collection(DB_COLLECTIONS.discussions)
      .doc(discussionId)
      .get()
      .then((snapshot) => (!snapshot ? null : snapshot.data()));
  }

  updateDiscussionLastMessage = async (discussionId, messageOwner) => {
    logger.log('updating discussion last message --> ', discussionId);

    try {
      return await this.axiosClient.post(
        this.endpoints.update,
        {
          discussionId,
          messageOwner,
        },
        {
          headers: {
            Authorization: await auth().currentUser.getIdToken(true),
          },
        }
      );
    } catch (error) {
      logger.error('UPDATE COMMON ERROR -> ', error);
      throw error;
    }
  }
}
