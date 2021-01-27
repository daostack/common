import {computed, observable, runInAction} from 'mobx';
import ListStore from './ListStore';
import {subscribeToAllCommons} from '~/Services/ListServices/CommonListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {Common} from '../Models/Common';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {DAO_REGISTERED} from '~/Firebase/Databasee';
import {Proposal} from '../Models/Proposal';
import {persist} from 'mobx-persist';

export default class CommonStore extends ListStore<Common> {
  @observable
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.isLoading = false;
  }

  @persist
  @computed
  get myCommons() {
    return this.getDataArray?.filter((common: Common) =>
      this.rootStore.authStore.isDaoMember(common?.members),
    );
  }

  @persist
  @computed
  get pendingCommons() {
    // if (
    //   this.isLoading ||
    //   this.rootStore.proposalStore.myActiveMembershipRequests?.length === 0
    // ) {
    //   return [];
    // } else {
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
    // }
  }

  @persist
  @computed
  get featuredCommons() {
    // return super.data;
    return this.getDataArray?.filter(
      (common: Common) =>
        !this.myCommons.includes(common) && common.register === DAO_REGISTERED,
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

    const updatesMap = new Map<string, ICommonEntity>();

    updatedUserList.forEach((commonEntity: ICommonEntity) => {
      //this.setData(commonEntity.id, new Common(commonEntity));
      updatesMap.set(commonEntity.id, new Common(commonEntity));
    });

    runInAction(() => {
      this.data.merge(updatesMap);
      this.isLoading = false;
    });
  };
}
