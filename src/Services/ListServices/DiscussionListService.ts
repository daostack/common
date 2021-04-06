import {DiscussionsCollection} from '~/Firebase/Databasee/Collections/DiscussionsCollection';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {axiosDiscussionClient} from '../util/AxiosClient';
import {auth} from '~/Firebase';
import {IFirebaseDoc, IFirebaseSnapshot} from '~/Firebase/types';

export type commonDiscussionsListLoadCallbackFn = (
  updatedDiscussionsList: IFirebaseSnapshot<IDiscussionEntity>,
) => void;

export const subscribeToCommonDiscussions = (
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

export const subscribeToDiscussionById = (
  discussionId: string,
  listChangeCallback: commonDiscussionsListLoadCallbackFn,
) =>
  DiscussionsCollection.doc(discussionId).onSnapshot((snapshot: any) => {
    listChangeCallback(snapshot);
  });

export const updateDiscussionLastMessage = async (
  discussionId: string,
  messageOwner: string,
) => {
  try {
    return await axiosDiscussionClient.getDiscussionClient().post(
      axiosDiscussionClient.getDiscussionEndpoints().update,
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

export const fetchDiscussionId = async (
  discussionId: string,
): Promise<IFirebaseDoc<IDiscussionEntity>> => {
  if (!discussionId) {
    throw new Error(
      'Discussion Id (discussionId) is required parameter, but it was not provided',
    );
  }
  return await DiscussionsCollection.doc(discussionId).get();
};
