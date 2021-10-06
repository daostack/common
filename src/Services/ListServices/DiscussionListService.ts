import {axiosDiscussionClient} from '../util/AxiosClient';
import {auth} from '~/Firebase';
import {IFirebaseSnapshot} from '~/Firebase/types';
import {DiscussionType} from '~/Graphql/Discussion/DiscussionType';
import {
  CreateDiscussionInput,
  CreateDiscussionDocument,
  GetDiscussionDocument,
  getDiscussionsVariable,
  GetDiscussionDocumentById,
} from '~/Graphql/Discussion';
import {Discussion} from '~/Stores/Models/Discussion';
import {apollo} from '~/Util/helpers/apolloHelper';

export type commonDiscussionsListLoadCallbackFn = (
  updatedDiscussionsList: IFirebaseSnapshot<DiscussionType>,
) => void;

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
  paginate,
}: getDiscussionsVariable): Promise<Discussion[]> => {
  const {data} = await apollo.query({
    query: GetDiscussionDocument,
    variables: {
      where,
      paginate,
    },
  });

  return data.discussions.map(
    (item: DiscussionType) => new Discussion(item, false),
  ) as Discussion[];
};

export const fetchDiscussionById = async (
  discussionId: string,
): Promise<DiscussionType> => {
  if (!discussionId) {
    throw new Error(
      'Discussion Id (discussionId) is required parameter, but it was not provided',
    );
  }
  const {data} = await apollo.query({
    query: GetDiscussionDocumentById,
    variables: {
      id: discussionId,
    },
  });

  return data.discussion as DiscussionType;
};
