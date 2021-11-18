import React from 'react';
import {
  CommonOperationalStateNotification,
  CommonProfileOptions,
  LoginSheetScreen,
  SortProposals,
  UnsavedChanges,
  TransactionError,
  PaymentStatusScreen,
  CancelSubscriptionSheetScreen,
  BackendErrorSheetScreen,
  LoadingExpired,
  HiddenContentInfo,
} from '~/Screens/BottomSheetScreens';

export const BottomSheetTemplates: Record<
  string,
  {
    topSnap: number;
    content: React.FunctionComponent<any> | React.ComponentClass;
    props?: Record<string, any>;
  }
> = {
  COMMON_OPERATIONAL_STATE_NOTIF: {
    topSnap: 440,
    content: CommonOperationalStateNotification,
  },
  SCREEN_OPTIONS: {
    topSnap: 280,
    content: CommonProfileOptions, // this should have its own component maybe?
    props: {
      isCommonProfile: false,
    },
  },
  SCREEN_COMMON_PROFILE_OPTIONS: {
    topSnap: 280,
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
  LOADING_EXPIRED: {
    topSnap: 480,
    content: LoadingExpired,
  },
  SORT_PROPOSALS: {
    topSnap: 500,
    content: SortProposals,
  },
  UNSAVED_CHANGES: {
    topSnap: 500,
    content: UnsavedChanges,
  },
  PAYMENT_STATUS: {
    topSnap: 500,
    content: PaymentStatusScreen,
  },
  CANCEL_SUBSCRIPTION: {
    topSnap: 450,
    content: CancelSubscriptionSheetScreen,
  },
  BACKEND_ERROR: {
    topSnap: 420,
    content: BackendErrorSheetScreen,
  },
  HIDDEN_CONTENT_INFO: {
    topSnap: 350,
    content: HiddenContentInfo,
  },
};
