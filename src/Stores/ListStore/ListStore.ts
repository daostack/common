import {
  observable,
  action,
  set,
  keys,
  get,
  ObservableMap,
  computed,
  values,
} from 'mobx';
import RootStore from '../RootStore';
import {persist} from 'mobx-persist';

export default class ListStore<IEntity> {
  @persist('map')
  @observable
  data: ObservableMap<string, IEntity>;

  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.data = observable.map({});
  }

  // Computed
  @computed
  get isEmpty(): boolean {
    return keys(this.data).length > 0;
  }

  @computed
  get getDataArray(): readonly IEntity[] {
    return values(this.data);
  }

  @action
  setData(id: string, modelStore: IEntity) {
    set(this.data, id, modelStore);
  }

  //Functions
  getDataById(id: string): IEntity | undefined {
    return get(this.data, id);
  }
}
