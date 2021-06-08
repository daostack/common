import {computed, observable, ObservableMap, action} from 'mobx';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {
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
    this.myCommons = observable.map(this.toEntityModelArr(commons));
  };

  @computed
  get myCommonsValues() {
    return this.toDataArray(this.myCommons);
  }

  @action
  loadPendingCommons = async (): Promise<void> => {
    const commons = await fetchUserPendingCommons();
    this.pendingCommons = observable.map(this.toEntityModelArr(commons));
  };

  @computed
  get pendingCommonsValues() {
    return this.toDataArray(this.pendingCommons);
  }

  @action
  loadFeaturedCommons = async (page: number = 0): Promise<void> => {
    const [myCommons, pendingCommons] = await Promise.all([
      fetchUserCommons(),
      fetchUserPendingCommons(),
    ]);
    const ids = [...myCommons, ...pendingCommons].map(
      (item: ICommonEntity) => item.id,
    );
    const commons = await fetchCommons({ids, page});

    const featuredCommonsMap = new Map<string, Common>();
    commons.forEach((item) => {
      featuredCommonsMap.set(item.id, item);
    });
    this.featuredCommons.forEach((value, key) => {
      if (!featuredCommonsMap.has(key)) {
        featuredCommonsMap.set(key, value);
      }
    });
    this.featuredCommons = observable.map(featuredCommonsMap);
  };

  @computed
  get featuredCommonsValues() {
    return this.toDataArray(this.featuredCommons);
  }

  getCommonById(id: string) {
    return this.getDataByIdAndCollections(id, [
      this.featuredCommons,
      this.pendingCommons,
      this.myCommons,
    ]);
  }

  // Overriden methods
  getEntityModel(entity: ICommonEntity): Common {
    return new Common(entity);
  }

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
