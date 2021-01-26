import {observable, action} from 'mobx';

export class BaseModel<I> implements I {
  @observable
  id: string = '';

  @observable
  createdAt: Date | null = null;

  @observable
  updatedAt: Date | null = null;

  @action
  setUpdates = (entity: Partial<I>) => {
    Object.keys(entity).forEach((key) => {
      this[key] = entity[key];
    });
  };
}
