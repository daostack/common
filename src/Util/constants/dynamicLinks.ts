export const DYNAMIC_LINK_URI_PREFIX = 'https://app.common.io';

export enum DYNAMIC_LINKS_TYPES {
  COMMON = 'common',
  PROPOSAL = 'proposal',
  DISCUSSION = 'discussion',
  DISCUSSION_MESSAGE = 'discussionMessage',
  USER = 'user',
}

export enum DYNAMIC_LINKS_SCREENS {
  discussion = 'Discussions',
  proposal = 'ProposalScreen',
  common = 'CommonProfile',
}

export enum DYNAMIC_LINKS_SCREEN_PARAMS {
  discussion = 'discussionId',
  proposal = 'proposalId',
  common = 'commonId',
  user = 'userId',
}
