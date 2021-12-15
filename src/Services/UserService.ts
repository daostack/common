import {UsersCollection} from '~/Firebase/Databasee/Collections/UsersCollection';
import {
  IUserEntity,
  UserPublicData,
} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseSnapshot,
} from '~/Firebase/types';
export type userListLoadCallbackFn = (
  updatedUserList: IFirebaseSnapshot<IUserEntity>,
) => void;
export type userLoadCallbackFn = (updatedUserList: IUserEntity | null) => void;

class UserService {
  subscribeToAllUsers(
    callback: userListLoadCallbackFn,
  ): FirestoreUnsubscribeFn {
    return UsersCollection.onSnapshot(
      (snapshot: IFirebaseSnapshot<IUserEntity>) => {
        callback(snapshot);
      },
    );
  }

  subscribeToUser(
    uid: string,
    callback: userListLoadCallbackFn,
  ): FirestoreUnsubscribeFn {
    return UsersCollection.doc(uid).onSnapshot(
      (snapshot: IFirebaseSnapshot<IUserEntity>) => {
        callback(snapshot);
      },
    );
  }

  async fetchUserById(userId: string): Promise<IFirebaseDoc<IUserEntity>> {
    if (!userId) {
      throw new Error(
        'User Id (userId) is required parameter, but it was not provided',
      );
    }
    return await UsersCollection.doc(userId).get();
  }

  // TODO: Move addUser and updateUser function in the clould functions project.
  async addUser(userId: string, newUser: UserPublicData): Promise<void> {
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
  }

  async updateUser(userId: string, user: IUserEntity): Promise<void> {
    if (!userId) {
      throw new Error(
        'User Id (userId) is required parameter, but was not provided.',
      );
    }

    return await UsersCollection.doc(userId).update(user);
  }
}

export default new UserService();
