import {DiscussionMessagesCollection} from '~/Firebase/Databasee/Collections/DiscussionMessagesCollection';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {IFirebaseDoc, IFirebaseSnapshot} from '~/Firebase/types';
import {db} from '~/Firebase';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {updateDiscussionLastMessage} from '~/Services/ListServices/DiscussionListService';

import {
CreateDiscussionMessageInput,
CreateDiscussionMessageDocument,
GetDiscussionMessageDocument,
} from '~/Graphql/Message';

import ApolloClient from '~/Services/util/ApolloClient';
import {getGQLErrorObject} from '~/Util';
import logger from '~/Services/Logger';
import {apollo} from '~/Util/helpers/apolloHelper';

export type commonDiscussionMessagesListLoadCallbackFn = (
  updatedDiscussionsList: IFirebaseSnapshot<IDiscussionMessageEntity>,
) => void;


// Create Proposals
export const createDiscussionMessage = async (formData: CreateDiscussionMessageInput) => {
  try {
    return await ApolloClient.getInstance().mutate({
      mutation: CreateDiscussionMessageDocument,
      variables: {
        discussionMessage: formData,
      },
    });
  } catch (err) {
    logger.log('Error while trying to create a new Funding Proposal: ', getGQLErrorObject(err));
    throw err;
  }
};

export const getProposalDiscussionMessages = async (discussionId: string): Promise<IDiscussionMessageEntity[]> => {
  try {
    const {data} = await apollo.query({
      query: GetDiscussionMessageDocument,
      variables: {
         id: discussionId,
      },
    });

    return data.discussion.messages;
  } catch (err) {
    logger.log('Error while trying to get Proposal discussion: ', getGQLErrorObject(err));
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

export const sendDiscussionImageMessage = async (
  discussionId: string,
  ownerId: string,
  payload: any,
) => {
  await db
    .collection(DB_COLLECTIONS.discussionMessages)
    .doc()
    .set(payload)
    .then(async (_) => {
      await updateDiscussionLastMessage(discussionId, ownerId);
    })
    .catch((error: Error) => {
      throw new Error(error.message);
    });
};
