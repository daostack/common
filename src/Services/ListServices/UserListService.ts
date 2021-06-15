import {UsersCollection} from '~/Firebase/Databasee/Collections/UsersCollection';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseSnapshot,
} from '~/Firebase/types';
import {apollo} from '~/Util/helpers/apolloHelper';
import {User, GetUserInfoDocument} from '~/Graphql';

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

export const fetchUserById = async (
  userId: string,
): Promise<IFirebaseDoc<IUserEntity>> => {
  if (!userId) {
    throw new Error(
      'User Id (userId) is required parameter, but it was not provided',
    );
  }
  return await UsersCollection.doc(userId).get();
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

export const getUserById = async (userId: string): Promise<User> => {
  const {data} = await apollo.query({
    query: GetUserInfoDocument,
    variables: {
      where: {
        userId,
      },
    },
  });

  return data.user as User;
};
