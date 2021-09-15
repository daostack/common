import {UsersCollection} from '~/Firebase/Databasee/Collections/UsersCollection';
import {UserType} from '~/Graphql/User';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseSnapshot,
} from '~/Firebase/types';
import {apollo} from '~/Util/helpers/apolloHelper';
import {GetUserInfoDocument} from '~/Graphql';
import {UserModel} from '~/Stores/Models/UserModel';

export type userListLoadCallbackFn = (
  updatedUserList: IFirebaseSnapshot<UserType>,
) => void;
export type userLoadCallbackFn = (updatedUserList: UserType | null) => void;

export const subscribeToAllUsers = (
  callback: userListLoadCallbackFn,
): FirestoreUnsubscribeFn =>
  UsersCollection.onSnapshot((snapshot: IFirebaseSnapshot<UserType>) => {
    console.log('---snapshot', snapshot);
    callback(snapshot);
  });

export const subscribeToUser = (
  uid: string,
  callback: userListLoadCallbackFn,
) =>
  UsersCollection.doc(uid).onSnapshot(
    (snapshot: IFirebaseSnapshot<UserType>) => {
      callback(snapshot);
    },
  );

export const fetchUserById = async (
  userId: string,
): Promise<IFirebaseDoc<UserType>> => {
  if (!userId) {
    throw new Error(
      'User Id (userId) is required parameter, but it was not provided',
    );
  }
  return await UsersCollection.doc(userId).get();
};

export const updateUser = async (
  userId: string,
  user: UserType,
): Promise<void> => {
  if (!userId) {
    throw new Error(
      'User Id (userId) is required parameter, but was not provided.',
    );
  }

  return await UsersCollection.doc(userId).update(user);
};

export const getUserById = async (userId: string): Promise<UserModel> => {
  const {data} = await apollo.query({
    query: GetUserInfoDocument,
    variables: {
      where: {
        userId,
      },
    },
  });

  return new UserModel(data.user);
};
