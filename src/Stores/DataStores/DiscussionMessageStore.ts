import BaseStore from './BaseStore';
import {
  fetchMessageById,
  subscribeToDiscussionsMessages,
  subscribeToProposalDiscussionMessages,
} from '~/Services/ListServices/DiscussionMessageListService';
import {FirestoreUnsubscribeFn, IFirebaseDocChange} from '~/Firebase/types';
import RootStore from '../RootStore';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {DiscussionMessage} from '../Models/DiscussionMessage';

export default class DiscussionMessageStore extends BaseStore<
  DiscussionMessage,
  IDiscussionMessageEntity
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  // Data consuming methods
  getDiscussionMessageById = (
    id: string,
  ): IDiscussionMessageEntity | undefined => {
    try {
      return this.getDataById(id);
    } catch (errr) {
      // Temporary logic for fetching Discussion in case it's not in the store.
      this.data.set(id, null);
      fetchMessageById(id).then((discussion: IDiscussionMessageEntity) => {
        this.data.set(id, new DiscussionMessage(discussion));
      });
      return this.getDataById(id);
    }
  };

  getDiscussionMessagesByDiscussionId = (
    discussionId: string,
  ): Array<DiscussionMessage> | undefined =>
    this.getDataArray
      ?.filter(
        (message: DiscussionMessage) => message.discussionId === discussionId,
      )
      .sort(
        (message: DiscussionMessage, prevMessage: DiscussionMessage) =>
          prevMessage.createdAt.seconds - message.createdAt.seconds,
      );

  //Actions
  subscribeToDiscussionsMessages = (
    discussionIds: Array<string>,
  ): FirestoreUnsubscribeFn =>
    subscribeToDiscussionsMessages(discussionIds, this.updateStoreData);

  subscribeToProposalDiscussionMessages = (
    proposalId: string,
  ): FirestoreUnsubscribeFn =>
    subscribeToProposalDiscussionMessages(proposalId, this.updateStoreData);

  // Overriden methods
  getEntityModel(entity: IDiscussionMessageEntity): DiscussionMessage {
    return new DiscussionMessage(entity);
  }

  firestoreDocToEntity(
    firebaseDoc: IFirebaseDocChange<IDiscussionMessageEntity>,
  ): IDiscussionMessageEntity {
    const entity = super.firestoreDocToEntity(firebaseDoc);
    return {
      ...entity,
      createdAt: entity.createTime,
    };
  }
}
