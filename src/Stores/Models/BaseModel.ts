import {observable} from 'mobx';
import {IBaseEntity} from '~/Firebase/Databasee/EntityTypes/IBaseEntity';
import {firebase} from '~/Firebase';
import { DatePickerAndroid } from 'react-native';

export class BaseModel<IEntity extends IBaseEntity> implements IBaseEntity {
  @observable
  id: string;

  @observable
  createdAt: TimeStamp;

  @observable
  updatedAt: Date;

  constructor(entity: IEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
