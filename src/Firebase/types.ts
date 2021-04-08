export type FirestoreUnsubscribeFn = () => void;

export interface IFirebaseSnapshot<DocsType> {
  docs: Array<IFirebaseDoc<DocsType>>;
  exists: () => boolean;
  empty: () => boolean;
  docChanges: () => Array<IFirebaseDocChange<DocsType>>;
}

export interface IFirebaseDoc<Entity> {
  id: string;
  exists: boolean;
  data: () => Entity;
}

export interface IFirebaseDocChange<Entity> {
  doc: IFirebaseDoc<Entity>;
}
