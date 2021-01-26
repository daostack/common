import {observable, runInAction} from 'mobx';
import ListStore from './ListStore';
import {
  subscribeToDiscussionsMessages,
  subscribeToProposalDiscussionMessages,
} from '~/Services/ListServices/DiscussionMessageListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
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

  getDiscussionMessages = (
    discussionId: string,
  ): Array<DiscussionMessage> | undefined =>
    this.getDataArray?.filter(
      (message: DiscussionMessage) => message.discussionId === discussionId,
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
    updatedDiscussionList: Array<IDiscussionMessageEntity>,
  ) => {
    console.log('updatedDiscussionList -> ', updatedDiscussionList);

    runInAction(() => {
      this.isLoading = true;
    });

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
