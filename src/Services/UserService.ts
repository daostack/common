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
import axios, {AxiosInstance} from 'axios';
import {usersUrl} from '~/Config';
import {auth} from '~/Firebase';

export type userListLoadCallbackFn = (
  updatedUserList: IFirebaseSnapshot<IUserEntity>,
) => void;
export type userLoadCallbackFn = (updatedUserList: IUserEntity | null) => void;

class UserService {
  private axiosClient: AxiosInstance;
  private endpoints: {create: string; update: string};

  constructor() {
    this.axiosClient = axios.create({
      baseURL: usersUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      create: '/create',
      update: '/update',
    };
  }

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

  async addUser(
    userId: string,
    newUser: UserPublicData,
    email: string,
  ): Promise<void> {
    if (!userId) {
      throw new Error(
        'User Id (userId) is required parameter, but was not provided.',
      );
    }

    try {
      return await this.axiosClient.post(this.endpoints.create, newUser, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
          email,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId: string, user: IUserEntity): Promise<void> {
    if (!userId) {
      throw new Error(
        'User Id (userId) is required parameter, but was not provided.',
      );
    }

    try {
      return await this.axiosClient.put(
        this.endpoints.update,
        {
          userId,
          changes: user,
        },
        {
          headers: {
            Authorization: await auth().currentUser.getIdToken(true),
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
