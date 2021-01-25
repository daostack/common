import {observable, decorate} from 'mobx';

export class BaseModel<I> implements I {
  id: string = '';
  createdAt: Date | null = null;
  updatedAt: Date | null = null;
}

decorate(BaseModel, {
  //observables
  id: observable,
  createdAt: observable,
  updatedAt: observable,
});
