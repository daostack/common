import {DiscussionsCollection} from '~/Firebase/Databasee/Collections/DiscussionsCollection';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';

export type commonDiscussionsListLoadCallbackFn = (
  updatedDiscussionsList: Array<IDiscussionEntity>,
) => void;

// .orderBy('lastMessage', 'desc')

export const subscribeToCommonDiscussions = (
  commonId: string,
  callback: commonDiscussionsListLoadCallbackFn,
) => {
  const unsubscribe = DiscussionsCollection.where(
    'commonId',
    '==',
    commonId,
  ).onSnapshot((snapshot: any) => {
    console.log('SNAPSHOT -> ', snapshot);
    let discussionList = [];

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      discussionList = snapshot.docs.map(
        // TODO: Add id prop in the document itself and apply the change here as well. (https://daostack1.atlassian.net/browse/CM-1532)
        (doc: any) => ({id: doc.id, ...doc.data()} as IDiscussionEntity),
      );
    }

    callback(discussionList);
  });
  return unsubscribe;
};

export const subscribeToProposalDiscussions = (
  proposalId: string,
  callback: commonDiscussionsListLoadCallbackFn,
) =>
  DiscussionsCollection.where('discussionId', '==', proposalId)
    .orderBy('createTime', 'desc')
    .onSnapshot((snapshot: any) => {
      let discussionList = [];

      // TODO: Make better handling of changes with docChanges()
      if (!snapshot?.empty || !snapshot) {
        discussionList = snapshot.docs.map(
          // TODO: Add id prop in the document itself and apply the change here as well. (https://daostack1.atlassian.net/browse/CM-1532)
          (doc: any) => ({id: doc.id, ...doc.data()} as IDiscussionEntity),
        );
      }

      callback(discussionList);
    });
