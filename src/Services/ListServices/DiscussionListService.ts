import {DiscussionsCollection} from '~/Firebase/Databasee/Collections/DiscussionsCollection';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {axiosDiscussionClient} from '../util/AxiosClient';
import {auth} from '~/Firebase';
import {IFirebaseSnapshot} from '~/Firebase/types';
import {
  CreateDiscussionInput,
  CreateDiscussionDocument,
  GetDiscussionsDocument,
  getDiscussionsVariable,
  GetDiscussionByIdDocument,
} from '~/Graphql/Discussion';
import {Discussion} from '../../Stores/Models/Discussion';
import {apollo} from '~/Util/helpers/apolloHelper';

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
): Promise<Discussion> => {
  if (!discussionId) {
    throw new Error(
      'Discussion Id (discussionId) is required parameter, but it was not provided',
    );
  }

  const {data} = await apollo.query({
    query: GetDiscussionByIdDocument,
    variables: {
      id: discussionId,
    },
  });

  return new Discussion(data, false);
};

export const createDiscussion = async (
  discussion: CreateDiscussionInput,
): Promise<Discussion> => {
  const {data} = await apollo.mutate({
    mutation: CreateDiscussionDocument,
    variables: {
      discussion,
    },
  });

  return new Discussion(data.createDiscussion, false);
};

export const fetchDiscussions = async ({
  where,
}: // paginate, TODO: Add after fix react-native-parallax
getDiscussionsVariable): Promise<Discussion[]> => {
  const {data} = await apollo.query({
    query: GetDiscussionsDocument,
    variables: {
      where,
    },
  });

  return data.discussions.map(
    (item: IDiscussionEntity) => new Discussion(item, false),
  ) as Discussion[];
};
