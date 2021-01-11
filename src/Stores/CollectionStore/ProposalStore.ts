import {observable, action, decorate, set, get, ObservableMap} from 'mobx';
import UserService from '~/Services/UserService';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {CommonModel} from '../ModelStore/CommonModelStore';

import {observable, action} from 'mobx';

export const ProposalStore = (proposalInfo) =>
  observable.object(
    {
      // Fields
      proposalsList: [],

      // Actions
      loadProposals() {
        // TODO: load proposals by criteria
      },
    },
    {
      setCommon: action,
    },
  );
