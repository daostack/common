import {DiscussionsCollection} from '~/Firebase/Databasee/Collections/DiscussionsCollection';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {auth} from '~/Firebase';
import axios, {AxiosInstance} from 'axios';
import {IFirebaseDoc, IFirebaseSnapshot} from '~/Firebase/types';
import {discussionsUrl} from '~/Config';

export type commonDiscussionsListLoadCallbackFn = (
  updatedDiscussionsList: IFirebaseSnapshot<IDiscussionEntity>,
) => void;

class DiscussionService {
  private axiosClient: AxiosInstance;
  private endpoints: {update: string};

  constructor() {
    this.axiosClient = axios.create({
      baseURL: discussionsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      update: '/update',
    };
  }

  subscribeToCommonDiscussions = (
    commonId: string,
    listChangeCallback: commonDiscussionsListLoadCallbackFn,
  ) => {
    const unsubscribe = DiscussionsCollection.where('commonId', '==', commonId)
      .orderBy('lastMessage', 'desc')
      .onSnapshot((snapshot: any) => {
        listChangeCallback(snapshot);
      });
    return unsubscribe;
  };

  subscribeToDiscussionById = (
    discussionId: string,
    listChangeCallback: commonDiscussionsListLoadCallbackFn,
  ) =>
    DiscussionsCollection.doc(discussionId).onSnapshot((snapshot: any) => {
      listChangeCallback(snapshot);
    });

  updateDiscussionLastMessage = async (
    discussionId: string,
    messageOwner: string,
  ): Promise<IDiscussionEntity> => {
    try {
      return await this.axiosClient.post(
        this.endpoints.update,
        {
          discussionId,
          messageOwner,
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
  };

  fetchDiscussionId = async (
    discussionId: string,
  ): Promise<IFirebaseDoc<IDiscussionEntity>> => {
    if (!discussionId) {
      throw new Error(
        'Discussion Id (discussionId) is required parameter, but it was not provided',
      );
    }
    return await DiscussionsCollection.doc(discussionId).get();
  };
}

export default new DiscussionService();
