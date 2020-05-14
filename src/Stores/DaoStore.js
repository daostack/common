import {observable, action, decorate} from 'mobx';

export const daoInfoFields = [
  'uid',
  'displayName',
  'email',
  'photoURL',
  'ethereumAddress',
  'intro',
  'byLine',
  'preferences',
];

class DaoStore {
  daoInfo;
  daos;
  isLoading;
  stage;
  isError;
  constructor() {
    isLoading = false;
    daos = [];
    stage = 0;
    isError = null;
  }

  setIsLoading = loading => {
    this.isLoading = loading;
  };

  setCreationStatus = _stage => {
    this.stage = _stage;
  };

  creationError = _error => {
    this.isError = _error;
  };

  setDaos = daosList => {
    let daoArray = [];
    if (daosList) {
      daoArray = daosList;
    } else {
      this.daos = null;
    }
    this.daos = daoArray;
  };
}

decorate(DaoStore, {
  setDaos: action,
  daos: observable,
  isLoading: observable,
  stage: observable,
});

export default DaoStore;
