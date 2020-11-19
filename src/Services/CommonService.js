import logger from './Logger';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {db} from '~/Firebase';

export default class CommonService {
  static serviceInstance = null;

  constructor() {}

  static getInstance = () => {
    if (CommonService.serviceInstance == null) {
      CommonService.serviceInstance = new CommonService();
    }
    return this.serviceInstance;
  };

  async getCommonInfo(commonUid) {
    logger.log(`commonUid -> ${commonUid}`);
    return db
      .collection(DB_COLLECTIONS.daos)
      .doc(commonUid)
      .get()
      .then((snapshots) => {
        if (!snapshots) {
          return null;
        }
        return snapshots.data();
      });
  }
}
