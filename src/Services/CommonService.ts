import axios, {AxiosInstance} from 'axios';
import {commonsUrl} from '~/Config';
import {auth} from '~/Firebase';
import {CommonsCollection} from '~/Firebase/Database/Collections/CommonsCollection';
import {ICommonEntity, CommonCreatedBody} from '~/Types';
import {IFirebaseSnapshot} from '~/Firebase/types';
import {getCurrentUser} from '~/Stores/Models/auth';

export type commonListLoadCallbackFn = (
  updatedCommonList: IFirebaseSnapshot<ICommonEntity>,
) => void;
export type commonLoadCallbackFn = (
  updatedCommonList: ICommonEntity | null,
) => void;

class CommonService {
  private axiosClient: AxiosInstance;
  private endpoints: {create: string; update: string};

  constructor() {
    this.axiosClient = axios.create({
      baseURL: commonsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      create: '/create',
      update: '/update',
    };
  }

  subscribeToAllCommons = (callback: commonListLoadCallbackFn) =>
    CommonsCollection.onSnapshot((snapshot: any) => {
      callback(snapshot);
    });

  createCommon = async (
    formData: CommonCreatedBody,
  ): Promise<ICommonEntity> => {
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
          Authorization: await getCurrentUser()?.getIdToken(true),
        },
      },
    );

  fetchCommonById = async (commonId: string) => {
    if (!commonId) {
      throw new Error(
        'Common Id (commonId) is required parameter, but it was not provided',
      );
    }
    return await CommonsCollection.doc(commonId).get();
  };
}

export default new CommonService();
