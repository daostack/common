import {func, string, object, shape, number} from 'prop-types';

export const uiStorePropTypes = shape({
  bottomSheetStore: shape({
    showBottomSheet: func.isRequired,
    hideBottomSheet: func.isRequired,
    topSnap: number.isRequired,
    template: object.isRequired,
    increseTopSnap: func,
    decreseTopSnap: func,
  }).isRequired,
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
  setIsLoading: func,
  setSignedInUser: func,
});

export const userStorePropTypes = shape({
  subscribeToAllUsers: func,
  getUserById: func,
});

export const commonStorePropTypes = shape({
  subscribeToAllCommons: func,
  getUserCommons: func,
});

export const proposalStorePropTypes = shape({
  subscribeToUserProposals: func,
  getProposalById: func,
});

export const discussionStorePropTypes = shape({
  subscribeToCommonDiscussions: func,
  getCommonDiscussions: func,
});

export const discussionMessageStorePropTypes = shape({
  subscribeToDiscussionsMessages: func,
  getDiscussionMessagesByDiscussionId: func,
});

export const rootStorePropTypes = shape({
  authStore: authStorePropTypes.isRequired,
  userStore: userStorePropTypes.isRequired,
  commonStore: commonStorePropTypes.isRequired,
  proposalStore: proposalStorePropTypes.isRequired,
  discussionStore: discussionStorePropTypes.isRequired,
  discussionMessageStore: discussionMessageStorePropTypes.isRequired,
  uiStore: uiStorePropTypes.isRequired,
});
