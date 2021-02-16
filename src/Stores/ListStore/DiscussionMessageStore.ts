import {observable, runInAction} from 'mobx';
import ListStore from './ListStore';
import {
  subscribeToDiscussionsMessages,
  subscribeToProposalDiscussionMessages,
} from '~/Services/ListServices/DiscussionMessageListService';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDocChange,
  IFirebaseSnapshot,
} from '~/Firebase/types';
import RootStore from '../RootStore';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {DiscussionMessage} from '../Models/DiscussionMessage';

export default class DiscussionMessageStore extends ListStore<DiscussionMessage> {
  @observable
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.isLoading = false;
  }

  // Data consuming methods
  getDiscussionMessageById = (
    id: string,
  ): IDiscussionMessageEntity | undefined => this.getDataById(id);

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
    subscribeToDiscussionsMessages(
      discussionIds,
      this._updateDiscussionMessageList,
    );

  subscribeToProposalDiscussionMessages = (
    proposalId: string,
  ): FirestoreUnsubscribeFn =>
    subscribeToProposalDiscussionMessages(
      proposalId,
      this._updateDiscussionMessageList,
    );

  // Private function
  _updateDiscussionMessageList = (
    updatedDiscussionList: IFirebaseSnapshot<IDiscussionMessageEntity>,
  ) => {
    runInAction(() => {
      this.isLoading = true;
    });

    const updatesMap = new Map<string, DiscussionMessage>();

    // Initial loading
    updatedDiscussionList
      .docChanges()
      .forEach(
        (
          updatedDiscussionMessageDoc: IFirebaseDocChange<IDiscussionMessageEntity>,
        ) => {
          // #datamodel
          // TODO: remove that data conversion when the data model in backend is changed.
          const data = updatedDiscussionMessageDoc.doc.data();
          const updatedDiscussionMessage = {
            ...{
              id: updatedDiscussionMessageDoc.doc.id,
              createdAt: data.createTime,
            },
            ...data,
          };

          updatesMap.set(
            updatedDiscussionMessage.id,
            new DiscussionMessage(updatedDiscussionMessage),
          );
        },
      );

    runInAction(() => {
      this.data.merge(updatesMap);
      this.isLoading = false;
    });
  };
}
