import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {db} from '~/Firebase';
import logger from './Logger';

export default class DiscussionService {
  static serviceInstance = null;

  constructor() {}

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

  async updateDiscussionLastMessage(discussionId) {
    return db
      .collection('discussion')
      .doc(discussionId)
      .update({
        lastMessage: new Date(),
      })
      .catch((err) => logger.log(err));
  }
}
