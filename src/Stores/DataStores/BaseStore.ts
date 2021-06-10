import {
  observable,
  get,
  ObservableMap,
  values,
  has,
  runInAction,
  computed,
  action,
  set,
  keys,
} from 'mobx';
import RootStore from '../RootStore';
import {persist} from 'mobx-persist';
import {IFirebaseDoc, IFirebaseDocChange, IFirebaseSnapshot} from '~/Firebase/types';
import {BaseModel} from '../Models/BaseModel';
import logger from '~/Services/Logger';

export default abstract class BaseStore<
  IEntityModel,
  IEntity extends BaseModel<IEntity>,
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
      console.log('err not exists')
      //throw Error(`Data with ID ${id} not exists.`);
    }
  }


  toEntityModelArr = (data: IEntity[]) => {
    const dataMap = new Map<string, IEntityModel>();
    data.forEach((currEntity: IEntity) => {
      dataMap.set(currEntity.id, this.getEntityModel(currEntity));
    });
    return dataMap;
  }





  updateDataMap = (entity: IEntityModel, dataMap: ObservableMap<string, IEntityModel>) => {
    const newDataMap = new Map<string, IEntityModel>();
    newDataMap.set(entity.id, entity);
    dataMap.merge(newDataMap);
  }

  existsInDataMap = (id: string, dataMap: ObservableMap<string, IEntityModel>) => has(dataMap, id)


  // OLD LOGIC WHICH SHOULD BE REMOVED IN THE FEATURE (or refacterd):
  getDataById(id: string): IEntityModel | undefined {
    if (has(this.data, id)) {
      return get(this.data, id);
    } else {
      throw Error(`Data with ID ${id} not exists.`);
    }
  }

  exists(id: string) {
    return has(this.data, id);
  }

  updateStoreData = (
    updatedSnapshot: IFirebaseSnapshot<IEntity> | IFirebaseDoc<IEntity>,
  ) => {
    if (!updatedSnapshot) {
      // TBD: Decide what to do in that case. Probably show a Toast with a warning.
      // That's happening sometimes when there is a problem with firebase like missing index, rules etc.
      logger.log('Firestore returned null as a snapshot');
      return;
    }

    runInAction(() => {
      this.isLoading = true;
    });

    const updatesMap = new Map<string, IEntityModel>();

    // Shapshot handling in case of doc list result
    if (typeof updatedSnapshot?.docChanges === 'function') {
      (updatedSnapshot as IFirebaseSnapshot<IEntity>)
        .docChanges()
        .forEach((updatedUserDoc: IFirebaseDocChange<IEntity>) => {
          const updatedEntity = this.firestoreDocChangeToEntity(updatedUserDoc);
          updatesMap.set(updatedEntity.id, this.getEntityModel(updatedEntity));
        });
    }
    // Shapshot handling in case of single doc result.
    // * Used for subscribeToEntityById type subscriptions
    else {
      const updatedFirebaseDoc = updatedSnapshot as IFirebaseDoc<IEntity>;
      const docData = this.prepareDocData(
        updatedFirebaseDoc.data(),
        updatedFirebaseDoc.id,
      );
      updatesMap.set(docData.id, this.getEntityModel(docData));
    }

    runInAction(() => {
      this.data.merge(updatesMap);
      this.isLoading = false;
    });
  };

  firestoreDocToEntity(firebaseDoc: IFirebaseDoc<IEntity>): IEntity {
    let docData: IEntity = firebaseDoc.data() as IEntity;
    return this.prepareDocData(docData, firebaseDoc.id);
  }

  firestoreDocChangeToEntity(
    firebaseDoc: IFirebaseDocChange<IEntity>,
  ): IEntity {
    let docData: IEntity = firebaseDoc.doc.data() as IEntity;
    return this.prepareDocData(docData, firebaseDoc.doc.id);
  }

  prepareDocData(docData: IEntity, id: string): IEntity {
    if (!docData.id) {
      docData = {
        ...docData,
        id,
      };
    }
    return docData;
  }

  @computed
  get isEmpty(): boolean {
    return keys(this.data).length > 0;
  }

  @computed
  get getDataArray(): readonly IEntityModel[] {
    return values(this.data);
  }

  @action
  setData(id: string, modelStore: IEntityModel) {
    set(this.data, id, modelStore);
  }
}
