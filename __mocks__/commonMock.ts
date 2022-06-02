import {Common} from '~/Stores/Models/Common';

export const commonMock: Common = {
  active: true,
  balance: 64100,
  byline: undefined,
  fundingGoalDeadline: 1606897465,
  id: '02314122-6b05-4563-a8ce-4a10e97b72da',
  image:
    'https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_02.png?alt=media',
  links: [],
  members: [],
  metadata: {
    action: 'boo',
    byline: '',
    contributionType: 'one-time',
    description: 'go yaniv go go',
    founderId: '97d5y9WXk1fEZv767j1ejKuHevi1',
    minFeeToJoin: 2400,
  },
  name: 'Emcff',
  raised: 90540,
  register: 'registered',
  reservedBalance: 8190,
  rules: [],
  updatedAt: {nanoseconds: 94000000, seconds: 1652196547},
  createdAt: {nanoseconds: 94000000, seconds: 1652196547},
  proposalCount: 0,
  messageCount: 0,
  discussionCount: 0,
  raisedFormatted: '5',
  balanceFormatted: '5',
  minFeeToJoinFormatted: () => '20',
};
