import React from 'react';
import {observable, action, decorate} from 'mobx';

import {
  CommonOperationalStateNotif,
  CommonProfileOptions,
  SafetyPeriodAbout,
  LoginSheetScreen,
  TransactionError,
  UnsavedChanges,
  SortProposals,
  BoostedInfo,
} from '~/Screens/BottomSheetScreens';

export const BOTTOM_SHEET_TEMPLATES = {
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
  SAFETY_PERIOD_ABOUT: {
    topSnap: 550,
    content: SafetyPeriodAbout,
  },
  PUBLISH_COMMON: {
    topSnap: 500,
    content: PublishCommon,
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
