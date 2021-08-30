import {DiscussionMessagesCollection} from '~/Firebase/Databasee/Collections/DiscussionMessagesCollection';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {IFirebaseDoc, IFirebaseSnapshot} from '~/Firebase/types';

import {
  CreateDiscussionMessageInput,
  CreateDiscussionMessageDocument,
  GetDiscussionMessageDocument,
} from '~/Graphql/Message';

import {getGQLErrorObject} from '~/Util';
import logger from '~/Services/Logger';
import {apollo} from '~/Util/helpers/apolloHelper';

export type commonDiscussionMessagesListLoadCallbackFn = (
  updatedDiscussionsList: IFirebaseSnapshot<IDiscussionMessageEntity>,
) => void;

export const createDiscussionMessage = async (
  formData: CreateDiscussionMessageInput,
) => {
  try {
    const data = await apollo.mutate({
      mutation: CreateDiscussionMessageDocument,
      variables: {
        discussionMessage: formData,
      },
    });
    return data;
  } catch (err) {
    logger.log(
      'Error while trying to create a new discussion message ',
      getGQLErrorObject(err),
    );
    throw err;
  }
};

export const getDiscussionMessages = async (
  discussionId: string,
): Promise<IDiscussionMessageEntity[]> => {
  try {
    const {data} = await apollo.query({
      query: GetDiscussionMessageDocument,
      variables: {
        id: discussionId,
      },
    });

    return data.discussion.messages;
  } catch (err) {
    logger.log(
      'Error while trying to get discussionMessage: ',
      getGQLErrorObject(err),
    );
    throw err;
  }
};

export const getProposalDiscussionMessages = async (
  proposalId: string,
): Promise<IDiscussionMessageEntity[]> => {
  try {
    const {data} = await apollo.query({
      query: GetDiscussionMessageDocument,
      variables: {
        id: proposalId,
      },
    });

    return data.discussion.messages;
  } catch (err) {
    logger.log(
      'Error while trying to get discussionMessage: ',
      getGQLErrorObject(err),
    );
    throw err;
  }
};

//OLD Methods: To be removed at the end of the migration
export const fetchDiscussionMessageById = async (
  messageId: string,
): Promise<IFirebaseDoc<IDiscussionMessageEntity>> => {
  if (!messageId) {
    throw new Error(
      'Message Id (messageId) is required parameter, but it was not provided',
    );
  }
  return await DiscussionMessagesCollection.doc(messageId).get();
};

export const subscribeToProposalDiscussionMessages = (
  proposalId: string,
  callback: commonDiscussionMessagesListLoadCallbackFn,
) =>
  DiscussionMessagesCollection.where('discussionId', '==', proposalId)
    .orderBy('createTime', 'desc')
    .onSnapshot((snapshot: IFirebaseSnapshot<IDiscussionMessageEntity>) => {
      callback(snapshot);
    });

export const subscribeToDiscussionsMessages = (
  discussionIds: Array<string>,
  callback: commonDiscussionMessagesListLoadCallbackFn,
) => {
  const chunkSize = 10;
  const unsubscribeArr = [];
  if (discussionIds?.length > 0) {
    for (let index = 0; index < discussionIds.length; index += chunkSize) {
      const currDiscussionIdsChunk = discussionIds.slice(
        index,
        index + chunkSize,
      );
      unsubscribeArr.push(
        DiscussionMessagesCollection.where(
          'discussionId',
          'in',
          currDiscussionIdsChunk,
        )
          .orderBy('createTime', 'desc')
          .onSnapshot(
            (snapshot: IFirebaseSnapshot<IDiscussionMessageEntity>) => {
              callback(snapshot);
            },
          ),
      );
    }
  }
  return unsubscribeArr;
};
