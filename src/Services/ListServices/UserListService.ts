import {UserCollection} from '~/Firebase/Databasee/Collections/UsersCollection';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';

export type callbackFn = (user: IUserEntity | null) => void;

export const subscribeToCommonlUsers = (
  commonId: string,
  callback: callbackFn,
) =>
  UserCollection.where('').onSnapshot((snapshot: any) => {
    let userList = [];

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      userList = snapshot.docs.map((doc: any) => doc.data() as IUserEntity);
    }

    callback(userList);
  });

export const subscribeToAllUsers = (callback: callbackFn) =>
  UserCollection.onSnapshot((snapshot: any) => {
    let userList = [];

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      userList = snapshot.docs.map((doc: any) => doc.data() as IUserEntity);
    }

    callback(userList);
  });

export const subscribeToUser = (uid: string, callback: callbackFn) =>
  UserCollection.doc(uid).onSnapshot((snapshot: any) => {
    let user: IUserEntity | null = null;

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      if (snapshot.docs.length !== 1) {
        throw new Error(
          'There are more than one documents with the provided uid!',
        );
      }
      user = snapshot.docs[0].data() as IUserEntity;
    }

    callback(user);
  });
