import { db } from '../Firebase';
import UserService from './UserService';

import { DB_COLLECTIONS } from '../Firebase/Databasee';

export default class DaoService {
  static serviceInstance = null;

  static getInstance = () => {
    if (DaoService.serviceInstance == null) {
      DaoService.serviceInstance = new DaoService();
    }
    return this.serviceInstance;
  };
  async getDaos() {
    return db.collection(DB_COLLECTIONS.daos).onSnapshot(snapshot => {
      if (snapshot.empty) {
        return [];
      }
      return snapshot.docs.map(doc => {
        return {...{id: doc.id}, ...doc.data()};
      });
    });
  }

  async getDaoNameById(daoId) {

    const dao = await db.collection(DB_COLLECTIONS.daos)
      .doc(daoId)
      .get();

    return dao.data().metadata.name;
  }

  async getDaoInfo(dao) {
    let daoCollection = db.collection(DB_COLLECTIONS.daos).doc(dao);
    daoCollection.onSnapshot(daoSnapshot => {
      console.log(`Received dao snapshot: ${daoSnapshot}`);
    }, err => {
      console.log(`Encountered error: ${err}`);
    });
    return db.collection('dao').onSnapshot(snapshot => {
      if (snapshot.empty) {
        return [];
      }
      return snapshot.docs.map(doc => {
        return {...{id: doc.id}, ...doc.data()};
      });
    });
  }

  async getUserDaos(userId, safeAddress) {
    let safeAddressVar = safeAddress;
    if (!safeAddressVar) {
      const user = await UserService.getInstance().getUserById(userId);
      safeAddressVar = user.safeAddress;
    }

    return db
      .collection(DB_COLLECTIONS.daos)
      .where('members', 'array-contains', {
        address: safeAddressVar,
        userId,
      })
      .get();
  }
}
