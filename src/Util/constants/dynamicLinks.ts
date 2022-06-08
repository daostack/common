import Config from 'react-native-config';

export const DYNAMIC_LINK_URI_PREFIX =
  Config.ENV === 'staging'
    ? 'https://staging.common.io'
    : 'https://app.common.io';
export const DYNAMIC_LINK_URI_WITH_SLASH = `${DYNAMIC_LINK_URI_PREFIX}/`;

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
  'invoices/submission' = 'AddInvoicesScreen',
}

export enum DYNAMIC_LINKS_SCREEN_PARAMS {
  discussion = 'discussionId',
  proposal = 'proposalId',
  common = 'commonId',
  user = 'userId',
  'invoices/submission' = 'proposalId',
}
