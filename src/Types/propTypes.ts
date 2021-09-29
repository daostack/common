import {func, string, object, shape, number, array, bool} from 'prop-types';

//TODO replace this with uiStoreType everywhere
export const uiStorePropTypes = shape({
  bottomSheetStore: shape({
    showBottomSheet: func.isRequired,
    hideBottomSheet: func.isRequired,
    topSnap: number.isRequired,
    template: object,
    increaseTopSnap: func.isRequired,
    decreaseTopSnap: func.isRequired,
  }).isRequired,
  appLoaderStore: shape({
    isLoading: bool.isRequired,
    showLoader: func.isRequired,
    hideLoader: func.isRequired,
  }),
  conversionRate: number.isRequired,
});

export type uiStoreType = {
  bottomSheetStore: {
    showBottomSheet: func,
    hideBottomSheet: func,
    topSnap: number,
    template: object,
    increaseTopSnap: func,
    decreaseTopSnap: func,
  },
  appLoaderStore: {
    isLoading: bool,
    showLoader: func,
    hideLoader: func,
  },
  conversionRate: number,
};


export const authStorePropTypes = shape({
  userInfo: shape({
    photoURL: string,
    email: string,
    firstName: string,
    lastName: string,
    intro: string,
  }),
  setIsLoading: func.isRequired,
  setSignedInUser: func.isRequired,
  isDaoMember: func.isRequired,
  getPermission: func.isRequired,
});

export const userStorePropTypes = shape({
  subscribeToAllUsers: func.isRequired,
  getUserById: func.isRequired,
});

export const commonStorePropTypes = shape({
  getCommonById: func.isRequired,
  myCommons: array.isRequired,
  updateCommonInfo: func.isRequired,
});

export const proposalStorePropTypes = shape({
  getProposalById: func.isRequired,
  getCommonProposals: func.isRequired,
  getUserProposals: func.isRequired,
  getCommonActiveProposals: func.isRequired,
  getCommonHistoryProposals: func.isRequired,
  getCommonPendingReqToJoins: func.isRequired,
  getCommonHistoryReqToJoins: func.isRequired,
});

export const discussionStorePropTypes = shape({
  getCommonDiscussions: func.isRequired,
  getDiscussionById: func.isRequired,
});

export const discussionMessageStorePropTypes = shape({
  subscribeToDiscussionsMessages: func.isRequired,
  getDiscussionMessagesByDiscussionId: func.isRequired,
  getDiscussionMessageById: func.isRequired,
});

export const notificationStorePropTypes = shape({
  getNotificationById: func.isRequired,
  loggedUserNotifications: array.isRequired,
  subscribeToLoggedUserNotifications: func.isRequired,
  deleteUserNotifications: func.isRequired,
  setNotificationItemState: func.isRequired,
  removeSeenStateForNewNotifications: func.isRequired,
  getProposalNotificationData: func.isRequired,
  getParentDiscussion: func.isRequired,
  addWelcomeNotification: func.isRequired,
  hasNewNotifications: bool.isRequired,
});


export const rootStorePropTypes = shape({
  authStore: authStorePropTypes.isRequired,
  userStore: userStorePropTypes.isRequired,
  commonStore: commonStorePropTypes.isRequired,
  proposalStore: proposalStorePropTypes.isRequired,
  discussionStore: discussionStorePropTypes.isRequired,
  discussionMessageStore: discussionMessageStorePropTypes.isRequired,
  notificationStore: notificationStorePropTypes.isRequired,
  uiStore: uiStorePropTypes.isRequired,
});
