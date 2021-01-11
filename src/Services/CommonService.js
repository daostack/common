import logger from './Logger';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {db} from '~/Firebase';
import Toast from '~/Util/Toast';

export default class CommonService {
  static serviceInstance = null;

  constructor() {}

  static getInstance = () => {
    if (CommonService.serviceInstance == null) {
      CommonService.serviceInstance = new CommonService();
    }
    return this.serviceInstance;
  };

  async loadMyCommonsList(userId, callback) {
    let daos = db
      .collection(DB_COLLECTIONS.daos)
      .where('members', 'array-contains', {
        userId,
      });

    return daos.onSnapshot(
      (snapshot) => {
        callback(snapshot);
      },
      (error) => Toast.error(error),
    );
  }
}
