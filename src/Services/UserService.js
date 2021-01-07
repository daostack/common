import {db} from '~/Firebase';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {UserCollection} from '~/Firebase/Databasee/Collections/UsersCollection';
import logger from './Logger';
import Toast from '~/Util/Toast';

const prepareUserObject = (user) => {
  if (!user) {
    return null;
  }

  let displayName = user.firstName ? user.firstName : null;
  if (user.lastName) {
    displayName = (displayName ? `${displayName} ` : '') + user.lastName;
  }
  return {...user, ...{displayName}};
};

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

  async subscribeToUserById(userId, callback) {
    let daos = db.collection(DB_COLLECTIONS.users).doc(userId);

    return daos.onSnapshot(
      (snapshot) => {
        let userInfo = null;

        if (snapshot.exists) {
          const currOwnerInfo = snapshot.data();
          userInfo = {
            ...currOwnerInfo,
            displayName: `${currOwnerInfo.firstName || ''} ${
              currOwnerInfo.lastName || ''
            }`,
          };
        }

        callback(userInfo);
      },
      (error) => Toast.error(error),
    );
  }

  async getUsersByUpTo10Ids(userIdsArr) {
    if (userIdsArr?.length > 10) {
      throw Error(
        'Firestore in operator supports max 10 length array. Please call that method on batches',
      );
    }

    return db
      .collection(DB_COLLECTIONS.users)
      .where('uid', 'in', userIdsArr)
      .get()
      .then((snapshots) => {
        if (!snapshots) {
          return null;
        }
        return snapshots.docs.map((doc) => prepareUserObject(doc.data()));
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
        return snapshots.docs.map((doc) => ({...{id: doc.id}, ...doc.data()}));
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

  // ======================================================================
  // New data management methods:
  // ======================================================================

  async subscribeToUsers(callback) {
    return UserCollection.onSnapshot(
      (snapshot) => {
        let userList = [];

        // TODO: Make better handling of changes with docChanges()
        if (!snapshot?.empty || !snapshot) {
          userList = snapshot.docs.map((doc) => doc.data());
        }

        callback(userList);
      },
      (error) => Toast.error(error),
    );
  }
}
