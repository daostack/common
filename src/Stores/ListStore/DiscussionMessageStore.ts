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
    this.getDataArray?.filter(
      (message: DiscussionMessage) => message.discussionId === discussionId,
    );

  getDiscussionMessageByProposalId = (proposalId: string) => {
    this.getDataArray?.filter(
      (message: DiscussionMessage) => message.discussionId === proposalId,
    );
  };
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
    console.log('updatedDiscussionList -> ', updatedDiscussionList);

    runInAction(() => {
      this.isLoading = true;
    });

    updatedDiscussionList
      .docChanges()
      .forEach(
        (
          updatedDiscussionMessageDoc: IFirebaseDocChange<IDiscussionMessageEntity>,
        ) => {
          const updatedDiscussionMessage = {
            ...{
              id: updatedDiscussionMessageDoc.doc.id,
            },
            ...updatedDiscussionMessageDoc.doc.data(),
          };

          let proposal = this.getDataById(updatedDiscussionMessage.id);
          if (proposal) {
            proposal.setUpdates(updatedDiscussionMessage);
          } else {
            this.setData(
              updatedDiscussionMessage.id,
              new DiscussionMessage(updatedDiscussionMessage),
            );
          }
        },
      );

    updatedDiscussionList.forEach(
      (discussionEntity: IDiscussionMessageEntity) => {
        this.setData(
          discussionEntity.id,
          new DiscussionMessage(discussionEntity),
        );
      },
    );

    runInAction(() => {
      this.isLoading = false;
    });
  };
}
