import {observable, action} from 'mobx';
import {IBaseEntity} from '~/Firebase/Databasee/EntityTypes/IBaseEntity';

export class BaseModel<IEntity extends IBaseEntity> implements IBaseEntity {
  @observable
  id: string;

  @observable
  createdAt: Date;

  @observable
  updatedAt: Date;

  constructor(entity: IEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  @action
  setUpdates = (entity: Partial<I>) => {
    Object.keys(entity).forEach((key) => {
      this[key] = entity[key];
    });
  };
}
