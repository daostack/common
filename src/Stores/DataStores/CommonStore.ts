import {computed, observable, ObservableMap, action} from 'mobx';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {
  subscribeToAllCommons,
  updateCommon,
  fetchUserCommons,
  fetchUserPendingCommons,
  fetchCommons,
  fetchCommonById,
} from '~/Services/ListServices/CommonListService';
import {Common} from '../Models/Common';
import RootStore from '../RootStore';
import BaseStore from './BaseStore';
import {UpdateCommonInfoInput} from '~/Graphql/Common';
import {CommonType} from '~/Graphql/Common/CommonType';
import {showErrorPopUp} from '~/Util';

export default class CommonStore extends BaseStore<Common, CommonType> {
  @observable
  isLoading: boolean;

  @observable
  private loadedCommons: ObservableMap<string, Common> = observable.map({});

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
    if (this.rootStore.authStore.signedInUser) {
      const commons = await fetchUserCommons();
      this.myCommons = observable.map(this.toEntityModelArr(commons));
    }
  };

  @computed
  get myCommonsValues() {
    return this.toDataArray(this.myCommons);
  }

  @action
  loadPendingCommons = async (): Promise<void> => {
    if (this.rootStore.authStore.signedInUser) {
      const commons = await fetchUserPendingCommons();
      this.pendingCommons = observable.map(this.toEntityModelArr(commons));
    }
  };

  @computed
  get pendingCommonsValues() {
    return this.toDataArray(this.pendingCommons);
  }

  @action
  loadFeaturedCommons = async (page: number = 0): Promise<void> => {
    let ids: Array<string> = [];
    if (this.rootStore.authStore.signedInUser) {
      const [myCommons, pendingCommons] = await Promise.all([
        fetchUserCommons(),
        fetchUserPendingCommons(),
      ]);
      ids = [...myCommons, ...pendingCommons].map(
        (item: CommonType) => item.id,
      );
    }
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

  @action
  async getCommonById(id: string) {
    try {
      return this.getDataByIdAndCollections(id, [
        this.loadedCommons,
        this.featuredCommons,
        this.pendingCommons,
        this.myCommons,
      ]);
    } catch (error) {
      try {
        const common = await fetchCommonById(id);
        this.loadedCommons = observable.map(this.toEntityModelArr([common]));
        return common;
      } catch (err) {
        showErrorPopUp(this.rootStore.uiStore.bottomSheetStore, err);
      }
    }
  }

  // Overriden methods
  getEntityModel(entity: CommonType): Common {
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
