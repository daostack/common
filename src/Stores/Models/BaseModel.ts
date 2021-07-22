import {observable} from 'mobx';
import {BaseType} from '~/Graphql/BaseType';

export class BaseModel<IEntity extends BaseType> implements BaseType {
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
}
