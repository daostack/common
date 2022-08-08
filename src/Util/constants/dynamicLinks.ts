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
  Discussions = 'Discussions',
  ProposalScreen = 'ProposalScreen',
  CommonProfile = 'CommonProfile',
  'invoices/submission' = 'AddInvoicesScreen',
  authCode = 'CommonWebview',
}

export enum DYNAMIC_LINKS_SCREEN_PARAMS {
  Discussions = 'discussionId',
  ProposalScreen = 'proposalId',
  CommonProfile = 'commonId',
  user = 'userId',
  'invoices/submission' = 'proposalId',
  authCode = 'authCode',
}
