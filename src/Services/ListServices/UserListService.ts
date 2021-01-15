import {UsersCollection} from '~/Firebase/Databasee/Collections/UsersCollection';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';

export type userListLoadCallbackFn = (
  updatedUserList: Array<IUserEntity>,
) => void;
export type userLoadCallbackFn = (updatedUserList: IUserEntity | null) => void;

export const subscribeToCommonUsers = (
  commonId: string,
  callback: userListLoadCallbackFn,
) =>
  UsersCollection.where('').onSnapshot((snapshot: any) => {
    let userList = [];

    // TODO: Implement that method when we have commons property in the user document.
    if (!snapshot?.empty || !snapshot) {
      userList = snapshot.docs.map((doc: any) => doc.data() as IUserEntity);
    }

    callback(userList);
  });

export const subscribeToAllUsers = (callback: userListLoadCallbackFn) =>
  UsersCollection.onSnapshot((snapshot: any) => {
    let userList = [];

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      userList = snapshot.docs.map((doc: any) => doc.data() as IUserEntity);
    }

    callback(userList);
  });

export const subscribeToUser = (uid: string, callback: userLoadCallbackFn) =>
  UsersCollection.doc(uid).onSnapshot((snapshot: any) => {
    let user: IUserEntity | null = null;

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      user = snapshot.data() as IUserEntity;
    }

    callback(user);
  });

export const getUserById = async (userId: string): Promise<IUserEntity> => {
  if (!userId) {
    throw new Error(
      'Method getUserById has a required param userId, but it was not provided',
    );
  }
  const user = await UsersCollection.doc(userId).get();
  console.log('USER -> ', user);
  return user.data() as IUserEntity;
};
