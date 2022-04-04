import {colors} from '~/Theme';

export enum VOTE_STATUSES {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ABSTAINED = 'abstained',
}

export enum VOTE_ICON_BY_STATUSES {
  approved = 'approved-24',
  rejected = 'reject-24',
  abstained = 'abstained-24',
}

export enum VOTE_MESSAGES {
  approved = 'Approved by you',
  rejected = 'Rejected by you',
  abstained = 'Abstained by you',
}

export const VOTE_COLORS_BY_STATUSES = {
  approved: colors.lightishGreen,
  rejected: colors.against,
  abstained: colors.greySubtitle,
};

export enum VOTE_TABS {
  ALL = 'All',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  ABSTAINED = 'Abstained',
}

export const VOTE_MODAL_INFO = {
  approved: {
    title: 'Approve',
    subtitle: 'Vote to approve this proposal',
    btnMessage: 'Vote to approve',
  },
  rejected: {
    title: 'Approve',
    subtitle: 'Vote to reject this proposal',
    btnMessage: 'Vote to reject',
  },
  abstained: {
    title: 'Approve',
    subtitle: 'Vote to abstain this proposal',
    btnMessage: 'Vote to abstain',
  },
};
