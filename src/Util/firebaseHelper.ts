import {get, has, values, ObservableMap} from 'mobx';
import {
  IFirebaseDoc,
  IFirebaseDocChange,
  IFirebaseSnapshot,
} from '~/Firebase/types';

export function getDataArray<T>(data: ObservableMap<string, T>): readonly T[] {
  return values(data);
}

export function getDataById<T>(
  data: ObservableMap<string, T>,
  id: string,
): T | undefined {
  if (has(data, id)) {
    return get(data, id);
  } else {
    throw Error(`Data with ID ${id} not exists.`);
  }
}

export const updateStoreData = <IEntity, IEntityModel>(
  getEntityModel: (entity: IEntity) => IEntityModel,
) => (
  updatedSnapshot: IFirebaseSnapshot<IEntity> | IFirebaseDoc<IEntity>,
): void => {
  if (!updatedSnapshot) {
    // TBD: Decide what to do in that case. Probably show a Toast with a warning.
    // That's happening sometimes when there is a problem with firebase like missing index, rules etc.
    return;
  }
  const updatesMap = new Map<string, IEntityModel>();

  // Shapshot handling in case of doc list result
  if (typeof updatedSnapshot?.docChanges === 'function') {
    (updatedSnapshot as IFirebaseSnapshot<IEntity>)
      .docChanges()
      .forEach((updatedUserDoc: IFirebaseDocChange<IEntity>) => {
        const updatedEntity = firestoreDocChangeToEntity(updatedUserDoc);
        updatesMap.set(updatedEntity.id, getEntityModel(updatedEntity));
      });
  }
  // Shapshot handling in case of single doc result.
  // * Used for subscribeToEntityById type subscriptions
  else {
    const updatedFirebaseDoc = updatedSnapshot as IFirebaseDoc<IEntity>;
    const docData = prepareDocData(
      updatedFirebaseDoc.data(),
      updatedFirebaseDoc.id,
    );
    updatesMap.set(docData.id, getEntityModel(docData));
  }

  // runInAction(() => {
  //   this.data.merge(updatesMap);
  //   this.isLoading = false;
  // });
};

export function firestoreDocToEntity<T>(firebaseDoc: IFirebaseDoc<T>): T {
  let docData: T = firebaseDoc.data() as T;
  return prepareDocData(docData, firebaseDoc.id);
}

export function firestoreDocChangeToEntity<T>(
  firebaseDoc: IFirebaseDocChange<T>,
): T {
  let docData: T = firebaseDoc.doc.data() as T;
  return prepareDocData(docData, firebaseDoc.doc.id);
}

export function prepareDocData<T>(docData: T, id: string): T {
  if (!docData?.id) {
    docData = {
      ...docData,
      id,
    };
  }
  return docData;
}
