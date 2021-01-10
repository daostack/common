import {db} from '~/Firebase';
import Toast from '~/Util/Toast';
import axios from 'axios';
import {commonsUrl} from '~/Config';
import logger from './Logger';

import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {auth} from '~/Firebase';

export default class DaoService {
  static serviceInstance = null;

  constructor() {
    this.axiosClient = axios.create({
      baseURL: commonsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      create: '/create',
    };
  }

  static getInstance = () => {
    if (DaoService.serviceInstance == null) {
      DaoService.serviceInstance = new DaoService();
    }
    return this.serviceInstance;
  };

  async getDaoById(daoId) {
    const dao = await db.collection(DB_COLLECTIONS.daos).doc(daoId).get();

    return dao.data();
  }

  async getDaoNameById(daoId) {
    const dao = await this.getDaoById(daoId);

    return dao.metadata.name;
  }

  async getUserDaos(userId) {
    return db
      .collection(DB_COLLECTIONS.daos)
      .where('members', 'array-contains', {
        userId,
      })
      .get();
  }

  async subscribeToMyDaosList(userId, callback) {
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

  async subscribeToDaosList(callback) {
    let daos = db.collection(DB_COLLECTIONS.daos);

    return daos.onSnapshot(
      (snapshot) => {
        callback(snapshot);
      },
      (error) => Toast.error(error),
    );
  }

  async subscribeToDaoById(daoId, callback) {
    let daos = db.collection(DB_COLLECTIONS.daos).doc(daoId);

    return daos.onSnapshot(
      (snapshot) => {
        callback(snapshot);
      },
      (error) => Toast.error(error),
    );
  }

  // async getDaoInfo(dao) {
  //   let daoCollection = db.collection(DB_COLLECTIONS.daos).doc(dao);
  //   daoCollection.onSnapshot(daoSnapshot => {
  //     console.log(`Received dao snapshot: ${daoSnapshot}`);
  //   }, err => {
  //     console.log(`Encountered error: ${err}`);
  //   });
  //   return db.collection('dao').onSnapshot(snapshot => {
  //     if (snapshot.empty) {
  //       return [];
  //     }
  //     return snapshot.docs.map(doc => {
  //       return {...{id: doc.id}, ...doc.data()};
  //     });
  //   });
  // }

  async getDaoList(callback) {
    const snapshot = await db.collection(DB_COLLECTIONS.daos).get();
    callback(snapshot);
  }

  //TODO: NoBlockchain: Move that logic in separate file ?
  async createCommon(formData) {
    try {
      return await this.axiosClient.post(this.endpoints.create, formData, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
    } catch (err) {
      console.log('CREATE COMMON ERROR -> ', err);
      throw err;
    }
  }

  editDao = async (daoId, dao) => {
    logger.log('editDao -> ', dao);
    return db.collection(DB_COLLECTIONS.daos).doc(daoId).update(dao);
  };
}
