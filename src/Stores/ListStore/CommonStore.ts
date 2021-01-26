import {computed, observable, runInAction} from 'mobx';
import ListStore from './ListStore';
import {subscribeToAllCommons} from '~/Services/ListServices/CommonListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {Common} from '../Models/Common';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {DAO_REGISTERED} from '~/Firebase/Databasee';
import {Proposal} from '../Models/Proposal';

export default class CommonStore extends ListStore<Common> {
  @observable
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.isLoading = false;
  }

  @computed
  get myCommons() {
    return this.isLoading
      ? []
      : this.getDataArray?.filter((common: Common) =>
          this.rootStore.authStore.isDaoMember(common?.members),
        );
  }

  @computed
  get pendingCommons() {
    if (
      this.isLoading ||
      this.rootStore.proposalStore.myActiveMembershipRequests?.length === 0
    ) {
      return [];
    } else {
      let commons: Array<ICommonEntity> = [];
      this.rootStore.proposalStore.myActiveMembershipRequests?.forEach(
        (proposal: Proposal) => {
          const currPendingCommon = this.getCommonById(proposal.commonId);
          if (currPendingCommon) {
            commons.push(currPendingCommon);
          }
        },
      );
      return commons;
    }
  }

  @computed
  get featuredCommons() {
    // return super.data;
    return this.isLoading
      ? []
      : this.getDataArray?.filter(
          (common: Common) =>
            !this.myCommons.includes(common) &&
            common.register === DAO_REGISTERED,
        );
  }

  // Data consuming methods
  getCommonById = (id: string): ICommonEntity | undefined =>
    this.getDataById(id);

  //Actions
  subscribeToAllCommons = (): FirestoreUnsubscribeFn =>
    subscribeToAllCommons(this._updateCommonList);

  // Private function
  _updateCommonList = (updatedUserList: Array<ICommonEntity>) => {
    runInAction(() => {
      this.isLoading = true;
    });

    updatedUserList.forEach((commonEntity: ICommonEntity) => {
      this.setData(commonEntity.id, new Common(commonEntity));
    });

    runInAction(() => {
      this.isLoading = false;
    });
  };
}
