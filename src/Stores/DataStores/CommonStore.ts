import {computed, observable, runInAction} from 'mobx';
import {fromPromise, IPromiseBasedObservable} from 'mobx-utils';
import {DAO_REGISTERED} from '~/Firebase/Databasee';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {
  fetchCommonById,
  subscribeToAllCommons,
  updateCommon,
  fetchUserCommons,
  fetchUserPendingCommons,
} from '~/Services/ListServices/CommonListService';
import {isDaoMemberByUserId, showBackendError} from '~/Util';
import {Common} from '../Models/Common';
import {Proposal} from '../Models/Proposal';
import RootStore from '../RootStore';
import BaseStore from './BaseStore';
import {UpdateCommonInfoInput} from '~/Graphql';

export default class CommonStore extends BaseStore<Common, ICommonEntity> {
  @observable
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.isLoading = false;
  }

  @computed
  get myObservableCommons() {
    try {
      return fromPromise((async () => await fetchUserCommons())());
    } catch (error) {
      return [];
    }
  }

  @computed get myCommons() {
    return (this.myObservableCommons as IPromiseBasedObservable<Common[]>).case(
      {
        pending: () => [],
        rejected: () => [],
        fulfilled: (value) => value,
      },
    );
  }

  @computed
  get pendingObservableCommons() {
    try {
      return fromPromise((async () => await fetchUserPendingCommons())());
    } catch (error) {
      return [];
    }
  }

  @computed
  get pendingCommons() {
    return (
      this.pendingObservableCommons as IPromiseBasedObservable<Common[]>
    ).case({
      pending: () => [],
      rejected: () => [],
      fulfilled: (value) => value,
    });
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
    } catch (err) {
      fetchCommonById(id)
        .then((common: Common) => {
          if (common.id) {
            runInAction(() => {
              this.setData(id, common);
            });
          }
        })
        .catch(() => {
          showBackendError({
            bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
          });
        });
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

  updateCommonInfo = async (updateCommonInfo: UpdateCommonInfoInput) => {
    try {
      return await updateCommon(updateCommonInfo);
    } catch (err) {
      throw err;
    }
  };
}
