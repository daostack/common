import {db} from '~/Firebase';
import {prepareUserObject} from '~/Util';

import {DB_COLLECTIONS} from '~/Firebase/Databasee';

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
        // console.log('snapshots : ', snapshots);
        if (!snapshots) {
          return null;
        }
        return prepareUserObject(snapshots.data());
      });
  }


  async getUserByAddress(address) {

    console.log('GETTING USER WITH ADDRESS -> ', address);

    return db
      .collection(DB_COLLECTIONS.users)
      .where('safeAddress', '==', address)
      .get()
      .then((snapshots) => {
        if (!snapshots) {
          return null;
        }
        const doc = snapshots.docs[0];
        return {id: doc.id, ...doc.data()};

      });
  }

  async getUsers() {
    console.log('getUsers-> ');
    return db
      .collection(DB_COLLECTIONS.users)
      .get()
      .then((snapshots) => {
        if (snapshots.empty) {
          return [];
        }
        return snapshots.docs.map((doc) => ({...{id: doc.id}, ...doc.data()}));
      });
  }
  async addUser(googleId, newUser) {
    console.log('addUser -> ', newUser);
    try {
      return db
        .collection(DB_COLLECTIONS.users)
        .doc(googleId)
        .set(newUser)
        .then((ref) => ref);
    } catch (error) {
      console.log('ERROR -> ', error);
    }
  }

  async editUser(userId, user) {
    console.log('editUser -> ', user);
    return db
      .collection(DB_COLLECTIONS.users)
      .doc(userId)
      .update(user)
      .then((ref) => {
        //console.log('Edited document with ID: ', ref.id);
      });
  }

}
