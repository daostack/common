import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {db} from '~/Firebase';

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
    return db.collection(DB_COLLECTIONS.discussions)
      .doc(discussionId)
      .get()
      .then((snapshot) => !snapshot ? null : snapshot.data());
  }

}
