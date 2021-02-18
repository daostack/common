import {observable, runInAction} from 'mobx';
import BaseStore from './BaseStore';
import {
  subscribeToCommonDiscussions,
  subscribeToProposalDiscussions,
} from '~/Services/ListServices/DiscussionListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {Discussion} from '../Models/Discussion';

export default class DiscussionStore extends BaseStore<Discussion> {
  @observable
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.isLoading = false;
  }

  // Data consuming methods
  getDiscussionById = (id: string): IDiscussionEntity | undefined =>
    this.getDataById(id);

  getCommonDiscussions = (commonId: string): Array<Discussion> | undefined =>
    this.getDataArray?.filter(
      (discussion: Discussion) => discussion.commonId === commonId,
    );
  //Actions
  subscribeToCommonDiscussions = (commonId: string): FirestoreUnsubscribeFn =>
    subscribeToCommonDiscussions(commonId, this._updateDiscussionList);

  subscribeToProposalDiscussions = (
    proposalId: string,
  ): FirestoreUnsubscribeFn =>
    subscribeToProposalDiscussions(proposalId, this._updateDiscussionList);

  // Private function
  _updateDiscussionList = (updatedDiscussionList: Array<IDiscussionEntity>) => {
    console.log('updatedDiscussionList -> ', updatedDiscussionList);

    runInAction(() => {
      this.isLoading = true;
    });

    updatedDiscussionList.forEach((discussionEntity: IDiscussionEntity) => {
      this.setData(discussionEntity.id, new Discussion(discussionEntity));
    });

    runInAction(() => {
      this.isLoading = false;
    });
  };
}
