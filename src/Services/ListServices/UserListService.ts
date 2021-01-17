import {UserCollection} from '~/Firebase/Databasee/Collections/UsersCollection';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';

export type userListLoadCallbackFn = (
  updatedUserList: Array<IUserEntity>,
) => void;
export type userLoadCallbackFn = (updatedUserList: IUserEntity | null) => void;

export const subscribeToCommonUsers = (
  commonId: string,
  callback: userListLoadCallbackFn,
) =>
  UserCollection.where('').onSnapshot((snapshot: any) => {
    let userList = [];

    // TODO: Implement that method when we have commons property in the user document.
    if (!snapshot?.empty || !snapshot) {
      userList = snapshot.docs.map((doc: any) => doc.data() as IUserEntity);
    }

    callback(userList);
  });

export const subscribeToAllUsers = (callback: userListLoadCallbackFn) =>
  UserCollection.onSnapshot((snapshot: any) => {
    let userList = [];

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      userList = snapshot.docs.map((doc: any) => doc.data() as IUserEntity);
    }

    callback(userList);
  });

export const subscribeToUser = (uid: string, callback: userLoadCallbackFn) =>
  UserCollection.doc(uid).onSnapshot((snapshot: any) => {
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
      'User Id (userId) is required parameter, but it was not provided',
    );
  }
  const user = await UserCollection.doc(userId).get();
  return user.data() as IUserEntity;
};

// TODO: Move addUser and updateUser function in the clould functions project.
export const addUser = async (
  userId: string,
  newUser: IUserEntity,
): Promise<void> => {
  if (!userId) {
    throw new Error(
      'User Id (userId) is required parameter, but was not provided.',
    );
  }

  const userSnapshot = await UserCollection.doc(userId).get();
  if (userSnapshot.exists) {
    throw new Error(
      `User with id ${userId} already exists in users collection.`,
    );
  }

  return await UserCollection.doc(userId).set(newUser);
};

export const updateUser = async (
  userId: string,
  user: IUserEntity,
): Promise<void> => {
  if (!userId) {
    throw new Error(
      'User Id (userId) is required parameter, but was not provided.',
    );
  }

  return await UserCollection.doc(userId).update(user);
};
