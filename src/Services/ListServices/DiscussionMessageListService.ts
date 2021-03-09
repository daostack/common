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

export const fetchMessageById = async (
  messageId: string,
): Promise<IDiscussionMessageEntity> => {
  if (!messageId) {
    throw new Error(
      'Message Id (messageId) is required parameter, but it was not provided',
    );
  }
  const message = await DiscussionMessagesCollection.doc(messageId).get();
  return {...message.data(), id: message.id} as IDiscussionMessageEntity;
};
