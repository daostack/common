import {observable, action} from 'mobx';
import {createCommonStore} from '../ListStore/CommonListStore';
import {createUserStore} from '../ListStore/UserListStore';
import {createProposalStore} from '../ListStore/ProposalListStore';

export const CommonModel = (commonInfo) =>
  observable.object(
    {
      // Fields
      uid: commonInfo.uid,
      // ...

      commonMembers: createUserStore(),

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
