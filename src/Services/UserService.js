import { db } from '~/Firebase';
import { prepareUserObject } from '~/Util';
import { DB_COLLECTIONS } from '~/Firebase/Databasee';
import logger from './Logger';

export default class UserService {
  static serviceInstance = null;

  static getInstance = () => {
    if (UserService.serviceInstance == null) {
      UserService.serviceInstance = new UserService();
    }
    return this.serviceInstance;
  };

  async getUserById(userId) {
    return db
      .collection(DB_COLLECTIONS.users)
      .doc(userId)
      .get()
      .then((snapshots) => {
        if (!snapshots) {
          return null;
        }
        return prepareUserObject(snapshots.data());
      });
  }


  async getUserByAddress(address) {

    logger.log('GETTING USER WITH ADDRESS -> ', address);

    return db
      .collection(DB_COLLECTIONS.users)
      .where('safeAddress', '==', address)
      .get()
      .then((snapshots) => {
        if (!snapshots) {
          return null;
        }
        const doc = snapshots.docs[0];
        return { id: doc.id, ...doc.data() };

      });
  }

  async getUsers() {
    logger.log('getUsers-> ');
    return db
      .collection(DB_COLLECTIONS.users)
      .get()
      .then((snapshots) => {
        if (snapshots.empty) {
          return [];
        }
<<<<<<< HEAD
        return snapshots.docs.map(doc => {
          return { ...{ id: doc.id }, ...doc.data() };
        });
=======
        return snapshots.docs.map((doc) => (
          {...{id: doc.id}, ...doc.data()}
        ));
>>>>>>> dev
      });
  }
  async addUser(googleId, newUser) {
    logger.log('addUser -> ', newUser);
    try {
      return db
        .collection(DB_COLLECTIONS.users)
        .doc(googleId)
        .set(newUser)
        .then((ref) => ref);
    } catch (error) {
      logger.log('ERROR -> ', error);
    }
  }

  async editUser(userId, user) {
    logger.log('editUser -> ', user);
    return db
      .collection(DB_COLLECTIONS.users)
      .doc(userId)
      .update(user)
      .then((ref) => {
        //logger.log('Edited document with ID: ', ref.id);
      });
  }

}
