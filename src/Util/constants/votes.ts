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
