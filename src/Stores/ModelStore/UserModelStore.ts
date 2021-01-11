import {observable, action} from 'mobx';
import CommonService from '~/Services/CommonService';
import {createCommonStore} from '../ListStore/CommonListStore';
import {createProposalStore} from '../ListStore/ProposalListStore';

export const UserModelStore = (userInfo) =>
  observable.object(
    {
      // Fields
      uid: userInfo.uid,
      email: userInfo.email,
      photoURL: userInfo.photoURL,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      createdAt: userInfo.createdAt,
      updatedAt: userInfo.updatedAt,

      // myCommons: createCommonStore(),
      // myPendingCommons: createCommonStore(),
      // myProposals: createProposalStore(),
      // myMembershipRequests: createProposalStore(),

      // Computed fields:
      get displayName() {
        return `${this.firstName || ''} ${this.lastName || ''}`;
      },
      get displayNameFormatted() {
        // The regex below is used to separate names and
        // make them less at most 25 character, but with cutting
        // the name only at whitespaces
        return this.displayName?.match(/.{1,25}(\s|$)/g)[0];
      },

      // Actions
      setUser(newUserInfo) {
        if (newUserInfo) {
          if (newUserInfo.uid) {
            this.uid = newUserInfo.uid;
          }
          if (newUserInfo.email) {
            this.email = newUserInfo.email;
          }
          if (newUserInfo.firstName) {
            this.firstName = newUserInfo.firstName;
          }
          if (newUserInfo.lastName) {
            this.lastName = newUserInfo.lastName;
          }
          if (newUserInfo.photoURL) {
            this.photoURL = newUserInfo.photoURL;
          }
        }
      },

      // loadMyCommons() {
      //   if (this.uid) {
      //     //CommonService.loadMyCommonsList(this.uid);
      //   }
      // },

      // loadMyPendingCommonsAndProposals() {
      //   if (this.uid) {
      //     //CommonService.loadMyCommonsList(this.uid);
      //   }
      // },
    },
    {
      setUser: action,
    },
  );
