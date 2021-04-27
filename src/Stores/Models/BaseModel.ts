import {observable} from 'mobx';
import {IBaseEntity} from '~/Firebase/Databasee/EntityTypes/IBaseEntity';
import {firebase} from '~/Firebase';

export class BaseModel<IEntity extends IBaseEntity> implements IBaseEntity {
  @observable
  id: string;

  @observable
  createdAt: firebase.firestore.Timestamp;

  @observable
  updatedAt: firebase.firestore.Timestamp;

  constructor(entity: IEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
