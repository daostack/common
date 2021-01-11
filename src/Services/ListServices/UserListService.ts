import {UserCollection} from '~/Firebase/Databasee/Collections/UsersCollection';
import Toast from '~/Util/Toast';

export const subscribeToCommonlUsers = (commonId, callback) =>
  UserCollection.where('').onSnapshot(
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

export const subscribeToAllUsers = (callback) =>
  UserCollection.onSnapshot(
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

export const subscribeToUser = (uid, callback) =>
  UserCollection.doc(uid).onSnapshot(
    (snapshot) => {
      let user = null;

      // TODO: Make better handling of changes with docChanges()
      if (!snapshot?.empty || !snapshot) {
        user = snapshot.docs.map((doc) => doc.data());
      }

      callback(user);
    },
    (error) => Toast.error(error),
  );
