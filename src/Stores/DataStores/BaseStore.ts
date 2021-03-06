import {
  observable,
  action,
  set,
  keys,
  get,
  ObservableMap,
  computed,
  values,
  runInAction,
  has,
} from 'mobx';
import RootStore from '../RootStore';
import {persist} from 'mobx-persist';
import {
  IFirebaseDoc,
  IFirebaseDocChange,
  IFirebaseSnapshot,
} from '~/Firebase/types';
import {IBaseEntity} from '~/Firebase/Databasee/EntityTypes/IBaseEntity';
import logger from '~/Services/Logger';

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

  abstract getEntityModel(entity: IEntity): IEntityModel;

  //Functions
  getDataById(id: string): IEntityModel | undefined {
    if (has(this.data, id)) {
      return get(this.data, id);
    } else {
      throw Error(`Data with ID ${id} not exists.`);
    }
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
      const updatedSnapshotChanges = updatedSnapshot as IFirebaseSnapshot<IEntity>;
      updatedSnapshotChanges
        .docChanges()
        .forEach((updatedUserDoc: IFirebaseDocChange<IEntity>) => {
          const updatedEntity = this.firestoreDocToEntity(updatedUserDoc);
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

  firestoreDocToEntity(firebaseDoc: IFirebaseDocChange<IEntity>): IEntity {
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
}
