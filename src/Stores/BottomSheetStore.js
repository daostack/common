import React from 'react';
import {observable, action, decorate} from 'mobx';

import {
  BoostedInfo,
  CommonOperationalStateNotif,
  CommonProfileOptions,
  LoginSheetScreen,
  SortProposals,
  UnsavedChanges,
  UserProfileSheetScreen,
} from '../Screens/BottomSheetScreens';
import TransactionError from '../Screens/BottomSheetScreens/TransactionError';

export const BOTTOM_SHEET_TEMPLATES = {
  BOOSTED_INFO: {
    topSnap: 600,
    content: BoostedInfo,
  },
  COMMON_OPERATIONAL_STATE_NOTIF: {
    topSnap: 440,
    content: CommonOperationalStateNotif,
  },
  SCREEN_OPTIONS: {
    topSnap: 280,
    content: CommonProfileOptions,
    props: {
      isCommonProfile: false,
    },
  },
  SCREEN_COMMON_PROFILE_OPTIONS: {
    topSnap: 480,
    content: CommonProfileOptions,
    props: {
      isCommonProfile: true,
    },
  },
  LOGIN_SHEET_SCREEN: {
    topSnap: 400,
    content: LoginSheetScreen,
  },
  TRANSACTION_ERROR: {
    topSnap: 480,
    content: TransactionError,
  },
  SORT_PROPOSALS: {
    topSnap: 500,
    content: SortProposals,
  },
  UNSAVED_CHANGES: {
    topSnap: 500,
    content: UnsavedChanges,
  },
  USER_PROFILE_SHEET_SCREEN: {
    topSnap: 500,
    content: UserProfileSheetScreen,
  },
};

class BottomSheetStore {
  template;
  topSnap;
  isVisible;
  constructor() {
    this.template = null;
    this.topSnap = 0;
    this.isVisible = false;
  }

  showBottomSheet = (currTemplate, props) => {
    let allProps = props;
    if (currTemplate.props) {
      allProps = {...currTemplate.props, ...props};
    }

    this.topSnap = currTemplate.topSnap;
    this.template = React.createElement(currTemplate.content, allProps);
    this.isVisible = true;
    console.log('showBottomSheet => ', currTemplate, this);
  };

  hideBottomSheet = () => {
    this.isVisible = false;
    this.topSnap = 0;
    this.template = null;
  };
}

decorate(BottomSheetStore, {
  showBottomSheet: action,
  topSnap: observable,
  template: observable,
  isVisible: observable,
});

export default BottomSheetStore;
