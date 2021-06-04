import {
  observable,
  get,
  ObservableMap,
  values,
  has,
} from 'mobx';
import RootStore from '../RootStore';
import {persist} from 'mobx-persist';
import {IBaseEntity} from '~/Firebase/Databasee/EntityTypes/IBaseEntity';

export default abstract class BaseStore<
  IEntityModel,
  IEntity extends IBaseEntity
> {
  @persist('map')
  @observable
  data: ObservableMap<string, IEntityModel> = observable.map({});

  @observable
  isLoading: boolean = false;

  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.isLoading = false;
  }


  toDataArray(dataArray: ObservableMap<string, IEntityModel>): readonly IEntityModel[] {
    return values(dataArray);
  }


  abstract getEntityModel(entity: IEntity): IEntityModel;

  //Functions
  getDataByIdAndCollections(id: string, dataCollections: ObservableMap<string, IEntityModel>[]): IEntityModel | undefined {
    let currDataValue: IEntityModel | undefined;
    dataCollections.forEach((currDataMap) => {
      if (has(currDataMap, id)) {
        currDataValue = get(currDataMap, id);
        return;
      }
    });

    if (currDataValue) {
      return currDataValue;
    }
    else {
      throw Error(`Data with ID ${id} not exists.`);
    }
  }


  toEntityModelArr = (data: IEntity[]) => {
    const dataMap = new Map<string, IEntityModel>();
    data.forEach((currEntity: IEntity) => {
      dataMap.set(currEntity.id, this.getEntityModel(currEntity));
    });
    return dataMap;
  }
}
