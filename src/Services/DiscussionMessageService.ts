import {DiscussionMessagesCollection} from '~/Firebase/Databasee/Collections/DiscussionMessagesCollection';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {IFirebaseDoc, IFirebaseSnapshot} from '~/Firebase/types';

export type commonDiscussionMessagesListLoadCallbackFn = (
  updatedDiscussionsList: IFirebaseSnapshot<IDiscussionMessageEntity>,
) => void;

class DiscussionMessageService {
  subscribeToProposalDiscussionMessages = (
    proposalId: string,
    callback: commonDiscussionMessagesListLoadCallbackFn,
  ) =>
    DiscussionMessagesCollection.where('discussionId', '==', proposalId)
      .orderBy('createTime', 'asc')
      .onSnapshot((snapshot: IFirebaseSnapshot<IDiscussionMessageEntity>) => {
        callback(snapshot);
      });

  subscribeToDiscussionsMessages = (
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
            .orderBy('createTime', 'asc')
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

  fetchDiscussionMessageById = async (
    messageId: string,
  ): Promise<IFirebaseDoc<IDiscussionMessageEntity>> => {
    if (!messageId) {
      throw new Error(
        'Message Id (messageId) is required parameter, but it was not provided',
      );
    }
    return await DiscussionMessagesCollection.doc(messageId).get();
  };
}

export default new DiscussionMessageService();
