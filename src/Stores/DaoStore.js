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
  dao;
  daos;
  isLoading;
  stage;
  isError;
  constructor() {
    this.isLoading = false;
    this.daos = [];
    this.stage = 0;
    this.isError = null;
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

  setDao = dao => {
    this.dao = dao;
  };
}

decorate(DaoStore, {
  dao: observable,
  setDaos: action,
  daos: observable,
  isLoading: observable,
  stage: observable,
});

export default DaoStore;
