import {observable, action, decorate} from 'mobx';

export const userInfoFields = [
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
  isLoading;
  myCommons;
  myProposals;
  constructor() {
    isLoading = false;
    daos = [];
  }

  setIsLoading = loading => {
    this.isLoading = loading;
  };

  setDaos = daoInfo => {
    if (daoInfo) {
      let daoObj = {};
      if (daoInfo.uid) {
        daoObj.uid = daoInfo.uid;
      }

      this.daoInfo = daoObj;
    } else {
      this.daoInfo = null;
    }
  };
}

decorate(DaoStore, {
  setDaos: action,
  daos: observable,
  isLoading: observable,
});

export default DaoStore;
