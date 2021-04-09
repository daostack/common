import {default as CommonOperationalStateNotif} from './CommonOperationalStateNotif';
import {default as CommonProfileOptions} from './CommonProfileOptions';
import {default as LoginSheetScreen} from './LoginSheetScreen';
import {default as SortProposals} from './SortProposals';
import {default as UnsavedChanges} from './UnsavedChanges';
import {default as TransactionError} from './TransactionError';
import {default as PaymentStatusScreen} from './PaymentStatusScreen';
import {default as CancelSubscription} from './CancelSubscriptionSheetScreen';
import {default as BackendErrorSheetScreen} from '~/Screens/BottomSheetScreens/BackendErrorSheetScreen';
import {default as LoadingExpired} from './LoadingExpired';
import {default as HiddenContentInfo} from './HiddenContentInfo';

export const BOTTOM_SHEET_TEMPLATES = {
  COMMON_OPERATIONAL_STATE_NOTIF: {
    topSnap: 440,
    content: CommonOperationalStateNotif,
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
    content: CancelSubscription,
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
