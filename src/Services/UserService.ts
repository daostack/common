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
import logger from '~/Services/Logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {ASYNC_STORAGE_KEYS} from '~/Util/constants/asyncStorage';

export type userListLoadCallbackFn = (
  updatedUserList: IFirebaseSnapshot<IUserEntity>,
) => void;
export type userLoadCallbackFn = (updatedUserList: IUserEntity | null) => void;

class UserService {
  private axiosClient: AxiosInstance;
  private endpoints: {
    create: string;
    update: string;
    createRefreshToken: string;
    getAccessToken: string;
  };

  constructor() {
    this.axiosClient = axios.create({
      baseURL: usersUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      create: '/create',
      update: '/update',
      createRefreshToken: '/auth/google/get-refresh-token',
      getAccessToken: '/auth/google/refresh',
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
    const idToken = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.idToken);

    try {
      return await this.axiosClient.post(this.endpoints.create, newUser, {
        headers: {
          Authorization: idToken,
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
    const idToken = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.idToken);

    try {
      return await this.axiosClient.put(
        this.endpoints.update,
        {
          userId,
          changes: user,
        },
        {
          headers: {
            Authorization: idToken,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async createRefreshToken(): Promise<void> {
    try {
      const authCode = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.serverAuthCode,
      );
      const idToken = await auth().currentUser?.getIdToken(true); // await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.idToken);

      await this.axiosClient.post(
        this.endpoints.createRefreshToken,
        {
          authCode,
        },
        {
          headers: {
            Authorization: idToken,
          },
        },
      );
    } catch (error) {
      logger.log('createRefreshToken', error);
    }
  }

  async getAccessToken(): Promise<string | undefined> {
    try {
      // const idToken = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.idToken);
      const idToken = await auth().currentUser?.getIdToken(true);
      const user = await UsersCollection.doc(auth()?.currentUser?.uid).get();

      const userData = user.data();
      const refreshToken = userData?.refreshToken;

      const {data} = await this.axiosClient.post(
        this.endpoints.getAccessToken,
        {
          refreshToken,
        },
        {
          headers: {
            Authorization: idToken,
          },
        },
      );

      return data.accessToken;
    } catch (error) {
      logger.log('getAccessToken', error);
    }
  }
}

export default new UserService();
