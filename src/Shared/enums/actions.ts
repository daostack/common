export enum ACTIONS {
  SEND_INVITATION = 'SEND_INVITATION',

  VIEW_COMMON = 'VIEW_COMMON',

  VIEW_PROPOSAL = 'VIEW_PROPOSAL',
  CREATE_PROPOSAL = 'CREATE_PROPOSAL',

  CREATE_VOTE = 'CREATE_VOTE',

  CREATE_DISCUSSION = 'CREATE_DISCUSSION',
  VIEW_DISCUSSION = 'VIEW_DISCUSSION',
  DELETE_DISCUSSION = 'DELETE_DISCUSSION',

  CREATE_POST = 'CREATE_POST',
  REPORT_POST = 'REPORT_POST',
  DELETE_POST = 'DELETE_POST',

  CONTRIBUTE = 'CONTRIBUTE',

  RECEIVE_FUNDS = 'RECEIVE_FUNDS',
}

export const GOVERNANCE_ACTIONS_OPTIONS = [
  {
    value: ACTIONS.SEND_INVITATION,
    label: 'Send Invitation',
  },
  {
    value: ACTIONS.VIEW_COMMON,
    label: 'View Common',
  },
  {
    value: ACTIONS.VIEW_PROPOSAL,
    label: 'View Proposal',
  },
  {
    value: ACTIONS.CREATE_PROPOSAL,
    label: 'Create Proposal',
  },
  {
    value: ACTIONS.CREATE_VOTE,
    label: 'Create Vote',
  },
  {
    value: ACTIONS.CREATE_DISCUSSION,
    label: 'Create Discussion',
  },
  {
    value: ACTIONS.VIEW_DISCUSSION,
    label: 'View Discussion',
  },
  {
    value: ACTIONS.DELETE_DISCUSSION,
    label: 'Delete Discussion',
  },
  {
    value: ACTIONS.CREATE_POST,
    label: 'Create Post',
  },
  {
    value: ACTIONS.REPORT_POST,
    label: 'Report Post',
  },
  {
    value: ACTIONS.DELETE_POST,
    label: 'Delete Post',
  },
  {
    value: ACTIONS.CONTRIBUTE,
    label: 'Contribute',
  },
  {
    value: ACTIONS.RECEIVE_FUNDS,
    label: 'Receive Funds',
  },
];
