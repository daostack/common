import {
  DiscussionMessageType,
  MessageType,
} from '~/Graphql/Message/MessageType';
import {IFirebaseSnapshot} from '~/Firebase/types';
import {
  CreateDiscussionMessageInput,
  CreateDiscussionMessageDocument,
  GetDiscussionMessageDocument,
  GetDiscussionMessageByIdDocument,
} from '~/Graphql/Message';
import {getGQLErrorObject} from '~/Util';
import logger from '~/Services/Logger';
import {apollo} from '~/Util/helpers/apolloHelper';

export type commonDiscussionMessagesListLoadCallbackFn = (
  updatedDiscussionsList: IFirebaseSnapshot<DiscussionMessageType>,
) => void;

export const createDiscussionMessage = async (
  formData: CreateDiscussionMessageInput,
) => {
  try {
    const data = await apollo.mutate({
      mutation: CreateDiscussionMessageDocument,
      variables: {
        discussionMessage: {...formData},
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
): Promise<DiscussionMessageType[]> => {
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
): Promise<DiscussionMessageType[]> => {
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
): Promise<MessageType> => {
  if (!messageId) {
    throw new Error(
      'Message Id (messageId) is required parameter, but it was not provided',
    );
  }

  const {data} = await apollo.query({
    query: GetDiscussionMessageByIdDocument,
    variables: {
      id: messageId,
    },
  });

  return data.discussionMessage;
};
