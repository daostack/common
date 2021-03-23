import {computed, observable} from 'mobx';
import BaseStore from './BaseStore';
import {
  subscribeToAllCommons,
  updateCommon,
} from '~/Services/ListServices/CommonListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {Common} from '../Models/Common';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {DAO_REGISTERED} from '~/Firebase/Databasee';
import {Proposal} from '../Models/Proposal';
import {isDaoMemberByUserId, showBackendError} from '~/Util';
export default class CommonStore extends BaseStore<Common, ICommonEntity> {
  @observable
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.isLoading = false;
  }

  @computed
  get myCommons() {
    try {
      return this.getDataArray.filter((common: Common) =>
        this.rootStore.authStore.isDaoMember(common?.members),
      );
    } catch (error) {
      return [];
    }
  }

  @computed
  get pendingCommons() {
    try {
      return this.rootStore.proposalStore.myActiveMembershipRequests.map(
        (proposal: Proposal) => this.getCommonById(proposal.commonId),
      );
    } catch (error) {
      return [];
    }
  }

  @computed
  get featuredCommons() {
    try {
      return this.getDataArray.filter(
        (common: Common) =>
          !this.myCommons.includes(common) &&
          !this.pendingCommons.includes(common) &&
          common.register === DAO_REGISTERED,
      );
    } catch (error) {
      return [];
    }
  }

  // Overriden methods
  getEntityModel(entity: ICommonEntity): Common {
    return new Common(entity);
  }

  // Data consuming methods
  getCommonById = (id: string): Common | undefined => {
    try {
      return this.getDataById(id);
    } catch (error) {
      showBackendError({
        bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
      });
      return;
    }
  };

  getUserCommons = (userId: string) => {
    try {
      return this.getDataArray.filter((common: Common) =>
        isDaoMemberByUserId(common?.members, userId),
      );
    } catch (error) {
      showBackendError({
        bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
      });
      return [];
    }
  };

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
      return updateCommon(updateCommonInfo);
    } catch (err) {
      throw err;
    }
  };
}
