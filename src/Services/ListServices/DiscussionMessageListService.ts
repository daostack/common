import {DiscussionMessagesCollection} from '~/Firebase/Databasee/Collections/DiscussionMessagesCollection';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {IFirebaseSnapshot} from '~/Firebase/types';

export type commonDiscussionMessagesListLoadCallbackFn = (
  updatedDiscussionsList: IFirebaseSnapshot<IDiscussionMessageEntity>,
) => void;

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
) =>
  discussionIds?.length > 0
    ? DiscussionMessagesCollection.where('discussionId', 'in', discussionIds)
        .orderBy('createTime', 'desc')
        .onSnapshot((snapshot: IFirebaseSnapshot<IDiscussionMessageEntity>) => {
          callback(snapshot);
        })
    : null;

export const fetchMessageById = async (
  messageId: string,
): Promise<IDiscussionMessageEntity> => {
  if (!messageId) {
    throw new Error(
      'Message Id (messageId) is required parameter, but it was not provided',
    );
  }
  const message = await DiscussionMessagesCollection.doc(messageId).get();
  return message.data() as IDiscussionMessageEntity;
};
