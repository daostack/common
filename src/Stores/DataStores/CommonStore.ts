import {computed, observable} from 'mobx';
import BaseStore from './BaseStore';
import {
  subscribeToAllCommons,
  updateCommon,
  fetchCommonById,
} from '~/Services/ListServices/CommonListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {Common} from '../Models/Common';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {DAO_REGISTERED} from '~/Firebase/Databasee';
import {Proposal} from '../Models/Proposal';
import {isDaoMemberByUserId} from '~/Util';
import {runInAction} from 'mobx';

export default class CommonStore extends BaseStore<Common, ICommonEntity> {
  @observable
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.isLoading = false;
  }

  @computed
  get myCommons() {
    return this.getDataArray.filter((common: Common) =>
      this.rootStore.authStore.isDaoMember(common?.members),
    );
  }

  @computed
  get pendingCommons() {
    return this.rootStore.proposalStore.myActiveMembershipRequests.map(
      (proposal: Proposal) => this.getCommonById(proposal.commonId),
    );
  }

  @computed
  get featuredCommons() {
    return this.getDataArray.filter(
      (common: Common) =>
        !this.myCommons.includes(common) &&
        !this.pendingCommons.includes(common) &&
        common.register === DAO_REGISTERED,
    );
  }

  // Overriden methods
  getEntityModel(entity: ICommonEntity): Common {
    return new Common(entity);
  }

  // Data consuming methods
  getCommonById = (id: string): Common | undefined => {
    try {
      return this.getDataById(id);
    } catch (err) {
      fetchCommonById(id).then((common: ICommonEntity) => {
        runInAction(() => {
          this.setData(id, this.getEntityModel(common));
        });
      });
      return undefined;
    }
  };

  getUserCommons = (userId: string) =>
    this.getDataArray.filter((common: Common) =>
      isDaoMemberByUserId(common?.members, userId),
    );

  //Actions
  subscribeToAllCommons = (): FirestoreUnsubscribeFn =>
    subscribeToAllCommons(this.updateStoreData);

  /**
   * This function is updating the common in the firebase with the new changes
   * @param  updateCommonInfo - a common object with new changes
   * @param  changedBy        - the user who is responsible for the change
   * @return                  - response returned from the updateCommon call
   */
  updateCommonInfo = async (updateCommonInfo: Partial<ICommonEntity>) => {
    try {
      const updateResponse = await updateCommon(updateCommonInfo);
      return updateResponse;
    } catch (err) {
      throw err;
    }
  };
}
