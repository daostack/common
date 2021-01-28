import {observable, action, decorate} from 'mobx';
import DaoService from '../Services/DaoService';
//import Cache from '../Util/Cache';

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
  /**
   * This function is updating the common in the firebase with the new changes
   * and the dao in the cache
   * (TODO when we start using mobx persist, we won't need this)
   * @param  updateCommonInfo - a common object with new changes
   * @param  changedBy        - the user who is responsible for the change
   * @return                  - response returned from the updateCommon call
   */
  updateDaoInfo = async (updateCommonInfo, changedBy) => {
    try {
      const updateResponse = await DaoService.getInstance().updateCommon({
        commonId: updateCommonInfo.id,
        changes: updateCommonInfo,
      });
      // Cache.set(updateCommonInfo.id, updateCommonInfo); @question to Lyubo: about this and mobx-persist
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
