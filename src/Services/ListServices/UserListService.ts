import {UsersCollection} from '~/Firebase/Databasee/Collections/UsersCollection';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {FirestoreUnsubscribeFn, IFirebaseSnapshot} from '~/Firebase/types';

export type userListLoadCallbackFn = (
  updatedUserList: IFirebaseSnapshot<IUserEntity>,
) => void;
export type userLoadCallbackFn = (updatedUserList: IUserEntity | null) => void;

export const subscribeToAllUsers = (
  callback: userListLoadCallbackFn,
): FirestoreUnsubscribeFn =>
  UsersCollection.onSnapshot((snapshot: IFirebaseSnapshot<IUserEntity>) => {
    callback(snapshot);
  });

export const subscribeToUser = (
  uid: string,
  callback: userListLoadCallbackFn,
) =>
  UsersCollection.doc(uid).onSnapshot(
    (snapshot: IFirebaseSnapshot<IUserEntity>) => {
      callback(snapshot);
    },
  );

export const fetchUserById = async (userId: string): Promise<IUserEntity> => {
  if (!userId) {
    throw new Error(
      'User Id (userId) is required parameter, but it was not provided',
    );
  }
  const user = await UsersCollection.doc(userId).get();
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

  const userSnapshot = await UsersCollection.doc(userId).get();
  if (userSnapshot.exists) {
    throw new Error(
      `User with id ${userId} already exists in users collection.`,
    );
  }

  return await UsersCollection.doc(userId).set(newUser);
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

  return await UsersCollection.doc(userId).update(user);
};
