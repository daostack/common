import {UserCollection} from '~/Firebase/Databasee/Collections/UsersCollection';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';

export type callbackFn = (user: IUserEntity) => void;

export const subscribeToCommonlUsers = (
  commonId: string,
  callback: callbackFn,
) =>
  UserCollection.where('').onSnapshot((snapshot) => {
    let userList = [];

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      userList = snapshot.docs.map((doc) => doc.data());
    }

    callback(userList);
  });

export const subscribeToAllUsers = (callback: callbackFn) =>
  UserCollection.onSnapshot((snapshot) => {
    let userList = [];

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      userList = snapshot.docs.map((doc) => doc.data());
    }

    callback(userList);
  });

export const subscribeToUser = (uid: string, callback: callbackFn) =>
  UserCollection.doc(uid).onSnapshot((snapshot) => {
    let user: IUserEntity | null = null;

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      user = snapshot.docs.map((doc) => doc.data());
    }

    callback(user);
  });
