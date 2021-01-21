import {observable, decorate, action} from 'mobx';

export class BaseModel<I> implements I {
  id: string = '';
  createdAt: Date | null = null;
  updatedAt: Date | null = null;

  setUpdates = (entity: Partial<I>) => {
    Object.keys(entity).forEach((key) => {
      this[key] = entity[key];
    });
  };
}

decorate(BaseModel, {
  //observables
  id: observable,
  createdAt: observable,
  updatedAt: observable,

  //aaction
  setUpdates: action,
});
