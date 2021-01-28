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
    return this.getDataArray?.filter((common: Common) =>
      this.rootStore.authStore.isDaoMember(common?.members),
    );
  }

  @computed
  get pendingCommons() {
    return this.rootStore.proposalStore.myActiveMembershipRequests?.map(
      (proposal: Proposal) => this.getCommonById(proposal.commonId),
    );
  }

  @computed
  get featuredCommons() {
    return this.getDataArray?.filter(
      (common: Common) =>
        !this.myCommons.includes(common) &&
        !this.pendingCommons.includes(common) &&
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

    const updatesMap = new Map<string, Common>();

    updatedUserList.forEach((commonEntity: ICommonEntity) => {
      updatesMap.set(commonEntity.id, new Common(commonEntity));
    });

    runInAction(() => {
      this.data.merge(updatesMap);
      this.isLoading = false;
    });
  };
}
