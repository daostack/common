import {observable, action, decorate} from 'mobx';
import DaoService from '../Services/DaoService';
import Cache from '../Util/Cache';

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

  setIsLoading = (loading) => {
    this.isLoading = loading;
  };

  setCreationStatus = (_stage) => {
    this.stage = _stage;
  };

  creationError = (_error) => {
    this.isError = _error;
  };

  setDaos = (daosList) => {
    let daoArray = [];
    if (daosList) {
      daoArray = daosList;
    } else {
      this.daos = null;
    }
    this.daos = daoArray;
  };
  updateDaoInfo = async (updateCommonInfo, currCommon) => {
    try {
      const updateResponse = await DaoService.getInstance().editDao(
        updateCommonInfo,
      );
      //Cache.set(updateCommonInfo.commonId, updateCommonInfo.common); //this is throwing error about it being a json
      return updateResponse;
    } catch (err) {
      throw err;
    }
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
