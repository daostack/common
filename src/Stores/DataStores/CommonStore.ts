import {computed, observable, ObservableMap, action} from 'mobx';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {
  fetchCommonById,
  subscribeToAllCommons,
  updateCommon,
  fetchUserCommons,
  fetchUserPendingCommons,
  fetchCommons,
} from '~/Services/ListServices/CommonListService';
import {isDaoMemberByUserId, showBackendError} from '~/Util';
import {Common} from '../Models/Common';
import RootStore from '../RootStore';
import BaseStore from './BaseStore';
import {UpdateCommonInfoInput} from '~/Graphql';

export default class CommonStore extends BaseStore<Common, ICommonEntity> {
  @observable
  isLoading: boolean;

  @observable
  private myCommons: ObservableMap<string, Common> = observable.map({});

  @observable
  private pendingCommons: ObservableMap<string, Common> = observable.map({});

  @observable
  private featuredCommons: ObservableMap<string, Common> = observable.map({});

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.isLoading = false;
  }

  @action
  loadMyCommons = async (): Promise<void> => {
    const commons = await fetchUserCommons();
    const myCommonsMap = new Map<string, Common>();
    commons.forEach((item) => {
      myCommonsMap.set(item.id, item);
    });
    this.myCommons = observable.map(myCommonsMap);
  };

  @computed
  get myCommonsValues() {
    return Array.from(this.myCommons.values());
  }

  @action
  loadPendingCommons = async (): Promise<void> => {
    const commons = await fetchUserPendingCommons();
    const pendingCommonsMap = new Map<string, Common>();
    commons.forEach((item) => {
      pendingCommonsMap.set(item.id, item);
    });
    this.pendingCommons = observable.map(pendingCommonsMap);
  };

  @computed
  get pendingCommonsValues() {
    return Array.from(this.pendingCommons.values());
  }

  @action
  loadFeaturedCommons = async (page: number = 0): Promise<void> => {
    const [myCommons, pendingCommons] = await Promise.all([
      fetchUserCommons(),
      fetchUserPendingCommons(),
    ]);
    const ids = [...myCommons, ...pendingCommons].map(
      (item: Common) => item.id,
    );
    const commons = await fetchCommons({ids: [], page});

    const featuredCommonsMap = new Map<string, Common>();
    commons.forEach((item) => {
      featuredCommonsMap.set(item.id, item);
    });
    let i = 0;
    console.log(
      '----------------',
      this.featuredCommons.keys(),
      featuredCommonsMap.keys(),
      commons,
    );
    this.featuredCommons.forEach((value, key) => {
      i++;
      console.log(
        'featuredCommonsMap.has(key)',
        this.featuredCommons.has(key),
        key,
        i,
      );
      if (!this.featuredCommons.has(key)) {
        console.log('key', key, 'value', value);
        featuredCommonsMap.set(key, value);
      }
    });
    this.featuredCommons = observable.map(featuredCommonsMap);
  };

  @computed
  get featuredCommonsValues() {
    return Array.from(this.featuredCommons.values());
  }

  // @computed
  // get myObservableCommons() {
  //   try {
  //     return fromPromise((async () => await fetchUserCommons())());
  //   } catch (error) {
  //     return [];
  //   }
  // }

  // @computed get myCommons() {
  //   return (this.myObservableCommons as IPromiseBasedObservable<Common[]>).case(
  //     {
  //       pending: () => [],
  //       rejected: () => [],
  //       fulfilled: (value) => value,
  //     },
  //   );
  // }

  // @computed
  // get pendingObservableCommons() {
  //   try {
  //     return fromPromise((async () => await fetchUserPendingCommons())());
  //   } catch (error) {
  //     return [];
  //   }
  // }

  // @computed
  // get pendingCommons() {
  //   return (
  //     this.pendingObservableCommons as IPromiseBasedObservable<Common[]>
  //   ).case({
  //     pending: () => [],
  //     rejected: () => [],
  //     fulfilled: (value) => value,
  //   });
  // }

  // @computed
  // get featuredCommons() {
  //   try {
  //     return this.getDataArray.filter(
  //       (common: Common) =>
  //         !this.myCommons.includes(common) &&
  //         !this.pendingCommons.includes(common) &&
  //         common.register === DAO_REGISTERED,
  //     );
  //   } catch (error) {
  //     return [];
  //   }
  // }

  // Overriden methods
  getEntityModel(entity: ICommonEntity): Common {
    return new Common(entity);
  }

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
