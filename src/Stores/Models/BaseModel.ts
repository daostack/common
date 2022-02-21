import {makeAutoObservable} from 'mobx';
import {IBaseEntity} from '~/Firebase/Databasee/EntityTypes/IBaseEntity';
import {firebase} from '~/Firebase';

export class BaseModel<IEntity extends IBaseEntity> implements IBaseEntity {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;

  constructor(entity: IEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    makeAutoObservable(this);
  }
}
