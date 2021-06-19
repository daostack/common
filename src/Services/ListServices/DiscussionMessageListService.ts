import {DiscussionMessagesCollection} from '~/Firebase/Databasee/Collections/DiscussionMessagesCollection';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {IFirebaseDoc, IFirebaseSnapshot} from '~/Firebase/types';
import {db} from '~/Firebase';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {updateDiscussionLastMessage} from '~/Services/ListServices/DiscussionListService';

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
