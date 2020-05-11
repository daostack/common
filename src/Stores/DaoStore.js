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
  constructor() {
    isLoading = false;
    daos = [];
  }

  setIsLoading = loading => {
    this.isLoading = loading;
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
});

export default DaoStore;
