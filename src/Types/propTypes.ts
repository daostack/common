import {func, string, object, shape, number, array, bool} from 'prop-types';

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
});

export const userStorePropTypes = shape({
  subscribeToAllUsers: func.isRequired,
  getUserById: func.isRequired,
});

export const commonStorePropTypes = shape({
  subscribeToAllCommons: func.isRequired,
  getUserCommons: func.isRequired,
  getCommonById: func.isRequired,
  myCommons: array.isRequired,
});

export const proposalStorePropTypes = shape({
  getProposalById: func.isRequired,
  getCommonProposals: func.isRequired,
  getUserProposals: func.isRequired,
});

export const discussionStorePropTypes = shape({
  subscribeToCommonDiscussions: func.isRequired,
  getCommonDiscussions: func.isRequired,
  getDiscussionById: func.isRequired,
});

export const discussionMessageStorePropTypes = shape({
  subscribeToDiscussionsMessages: func.isRequired,
  getDiscussionMessagesByDiscussionId: func.isRequired,
});

export const notificationStorePropTypes = shape({
  getNotificationById: func.isRequired,
  getLoggedUserNotifications: func.isRequired,
  subscribeToLoggedUserNotifications: func.isRequired,
  deleteUserNotifications: func.isRequired,
});

export const rootStorePropTypes = shape({
  authStore: authStorePropTypes.isRequired,
  userStore: userStorePropTypes.isRequired,
  commonStore: commonStorePropTypes.isRequired,
  proposalStore: proposalStorePropTypes.isRequired,
  discussionStore: discussionStorePropTypes.isRequired,
  discussionMessageStore: discussionMessageStorePropTypes.isRequired,
  notificationStorePropTypes: notificationStorePropTypes.isRequired,
  uiStore: uiStorePropTypes.isRequired,
});
