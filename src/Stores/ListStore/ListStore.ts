import {
  observable,
  action,
  decorate,
  set,
  keys,
  get,
  ObservableMap,
  computed,
} from 'mobx';

export type FirestoreUnsubscribeFn = () => void;

export default class ListStore<IEntity> {
  unsubscribeDataChanges: FirestoreUnsubscribeFn | null;
  dataList: ObservableMap<string, IEntity>;
  isLoading: boolean;

  constructor() {
    this.dataList = observable.map({});
    this.isLoading = false;
    this.unsubscribeDataChanges = null;
  }

  // Computed
  get isEmpty(): boolean {
    return keys(this.dataList).length > 0;
  }

  //Actions
  clearListStore() {
    this.unsubscribeDataChanges && this.unsubscribeDataChanges();
    this.dataList = observable.map({});
  }

  setData(id: string, modelStore: IEntity) {
    set(this.dataList, id, modelStore);
  }

  subscribeToDataChanges(unsubscribeFunc: FirestoreUnsubscribeFn) {
    this.clearListStore();
    this.unsubscribeDataChanges = unsubscribeFunc;
  }

  //Functions
  getDataById(id: string): IEntity | undefined {
    return get(this.dataList, id);
  }
}

decorate(ListStore, {
  isLoading: observable,
  dataList: observable,

  isEmpty: computed,

  clearListStore: action,
  setData: action,
  subscribeToDataChanges: action,
});
