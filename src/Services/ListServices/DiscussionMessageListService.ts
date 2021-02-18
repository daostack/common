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
      // let discussionList = [];

      // // TODO: Make better handling of changes with docChanges()
      // if (!snapshot?.empty || !snapshot) {
      //   discussionList = snapshot.docs.map(
      //     // TODO: Add id prop in the document itself and apply the change here as well. (https://daostack1.atlassian.net/browse/CM-1532)
      //     (doc: any) =>
      //       ({id: doc.id, ...doc.data()} as IDiscussionMessageEntity),
      //   );
      // }

      // callback(discussionList);
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
