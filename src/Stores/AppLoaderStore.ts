import {action, makeObservable, observable} from 'mobx';

class AppLoaderStore {
  @observable
  isLoading: boolean = false;

  @action
  showLoader = (): void => {
    this.isLoading = true;
  };

  @action
  hideLoader = (): void => {
    this.isLoading = false;
  };

  constructor() {
    makeObservable(this);
  }
}

export default AppLoaderStore;
