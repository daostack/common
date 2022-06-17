import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {commonsUrl} from '~/Config';
import {auth} from '~/Firebase';
import {
  CommonsCollection,
  CommonsMemberCollection,
} from '~/Firebase/Databasee/Collections/CommonsCollection';
import {
  ICommonEntity,
  CommonCreatedBody,
  CommonImmediateContributionBody,
} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {PaymentResponse} from '~/Firebase/Databasee/EntityTypes/IPaymentEntity';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseSnapshot,
} from '~/Firebase/types';

export type commonListLoadCallbackFn = (
  updatedCommonList: IFirebaseSnapshot<ICommonEntity>,
) => void;
export type commonLoadCallbackFn = (
  updatedCommonList: ICommonEntity | null,
) => void;

class CommonService {
  private axiosClient: AxiosInstance;
  private endpoints: {
    create: string;
    update: string;
    delete: string;
    leave: string;
    immediateContribution: string;
  };

  constructor() {
    this.axiosClient = axios.create({
      baseURL: commonsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      create: '/create',
      update: '/update',
      delete: '/deactivate',
      leave: '/leave',
      immediateContribution: '/immediate-contribution',
    };
  }

  subscribeToAllCommons = (callback: commonListLoadCallbackFn) =>
    CommonsCollection.onSnapshot((snapshot: any) => {
      callback(snapshot);
    });

  subscribeToMyCommons = async (
    userId: string,
    callback: commonListLoadCallbackFn,
  ): FirestoreUnsubscribeFn =>
    CommonsMemberCollection.where('userId', '==', userId).onSnapshot(
      (snapshot: any) => {
        callback(snapshot);
      },
    );

  createCommon = async (
    formData: CommonCreatedBody,
  ): Promise<AxiosResponse<ICommonEntity>> => {
    try {
      return await this.axiosClient.post(this.endpoints.create, formData, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
    } catch (err) {
      throw err;
    }
  };

  immediateContribution = async (
    data: CommonImmediateContributionBody,
  ): Promise<
    AxiosResponse<PaymentResponse & {link: string; paymentId: string}>
  > => {
    try {
      return await this.axiosClient.post(
        this.endpoints.immediateContribution,
        data,
        {
          headers: {
            Authorization: await auth().currentUser.getIdToken(true),
          },
        },
      );
    } catch (err) {
      throw err;
    }
  };

  updateCommon = async (
    updateCommonInfo: Partial<ICommonEntity>,
  ): Promise<void> =>
    await this.axiosClient.post(
      this.endpoints.update,
      {
        commonId: updateCommonInfo.id,
        changes: updateCommonInfo,
      },
      {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      },
    );

  deleteCommon = async (commonId: string): Promise<void> => {
    await this.axiosClient.post(
      this.endpoints.delete,
      {
        commonId,
      },
      {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      },
    );
  };

  leaveCommon = async (commonId: string): Promise<void> => {
    await this.axiosClient.post(
      this.endpoints.leave,
      {
        commonId,
      },
      {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      },
    );
  };

  fetchCommonById = async (
    commonId: string,
  ): Promise<IFirebaseDoc<ICommonEntity>> => {
    if (!commonId) {
      throw new Error(
        'Common Id (commonId) is required parameter, but it was not provided',
      );
    }
    return await CommonsCollection.doc(commonId).get();
  };
}

export default new CommonService();
