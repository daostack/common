import {db} from '~/Firebase';
import UserService from './UserService';
import Toast from '~/Util/Toast';
import axios from 'axios';
import {commonsUrl} from '~/Config';

import {DB_COLLECTIONS} from '~/Firebase/Databasee';

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

    const dao = await db.collection(DB_COLLECTIONS.daos)
      .doc(daoId)
      .get();

    return dao.data();
  }

  async getDaoNameById(daoId) {

    const dao = await this.getDaoById(daoId);

    return dao.metadata.name;
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

  async subscribeToMyDaosList(userId, safeAddress, callback) {
    let daos = db
      .collection(DB_COLLECTIONS.daos)
      .where('members', 'array-contains', {
        address: safeAddress,
        userId,
      });

    return daos.onSnapshot((snapshot) => {
      callback(snapshot);
    }, (error) => Toast.error(error));

  }

  async subscribeToDaosList(callback) {
    let daos = db
      .collection(DB_COLLECTIONS.daos);

    return daos.onSnapshot((snapshot) => {
      callback(snapshot);
    }, (error) => Toast.error(error));
  }

  async subscribeToDaoById(daoId, callback) {
    let daos = db
      .collection(DB_COLLECTIONS.daos)
      .doc(daoId);

    return daos.onSnapshot((snapshot) => {
      callback(snapshot);
    }, (error) => Toast.error(error));

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


  async createCommon(formData) {
    try {
      return await this.axiosClient.post(this.endpoints.create,
        {
          headers: {
            'Authorization': `token test`,
          }, 
          data: formData
        }
      );
    } catch (err) {
      console.log("CREATE COMMON ERROR -> ", err);
      throw err;
    }
  }

}
