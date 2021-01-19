import {
  observable,
  action,
  decorate,
  set,
  keys,
  get,
  ObservableMap,
  computed,
  values,
} from 'mobx';
import RootStore from '../RootStore';
export default class ListStore<IEntity> {
  data: ObservableMap<string, IEntity>;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.data = observable.map({});
  }

  // Computed
  get isEmpty(): boolean {
    return keys(this.data).length > 0;
  }

  get getDataArray(): readonly IEntity[] {
    return values(this.data);
  }

  setData(id: string, modelStore: IEntity) {
    set(this.data, id, modelStore);
  }

  //Functions
  getDataById(id: string): IEntity | undefined {
    return get(this.data, id);
  }
}

decorate(ListStore, {
  // Observables
  data: observable,
  // Computed
  isEmpty: computed,
  getDataArray: computed,

  // Actions
  setData: action,
});
