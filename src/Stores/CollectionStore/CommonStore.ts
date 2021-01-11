import {observable, action, decorate, set, get, ObservableMap} from 'mobx';
import UserService from '~/Services/UserService';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {CommonModel} from '../ModelStore/CommonModelStore';

import {observable, action} from 'mobx';

export const CommonStore = (commonInfo) =>
  observable.object(
    {
      // Fields
      commonsList: [],

      // Actions
      setCommon(newCommonInfo) {
        if (newCommonInfo) {
          if (newCommonInfo.uid) {
            this.uid = newCommonInfo.uid;
          }
        }
      },
    },
    {
      setCommon: action,
    },
  );
