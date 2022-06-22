import {COMMON_REGISTERED} from '~/Shared/enums/commonRegistered';
import {COMMON_STATE} from '~/Shared/enums/commonState';
import {Common} from '~/Stores/Models/Common';

export const commonMock: Common = {
  id: '02314122-6b05-4563-a8ce-4a10e97b72da',
  name: 'Emcff',
  image:
    'https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_02.png?alt=media',
  balance: 64100,
  reservedBalance: 8190,
  raised: 90540,
  links: [],
  register: COMMON_REGISTERED.REGISTERED,
  updatedAt: {nanoseconds: 94000000, seconds: 1652196547},
  createdAt: {nanoseconds: 94000000, seconds: 1652196547},
  proposalCount: 0,
  messageCount: 0,
  discussionCount: 0,
  memberCount: 0,
  raisedFormatted: '5',
  balanceFormatted: '5',
  minFeeToJoinFormatted: () => '20',
  founderId: '97d5y9WXk1fEZv767j1ejKuHevi1',
  governanceId: '08febcf1-64a2-468c-bea6-a67fb1f1cd55',
  byline: 'byline',
  description: 'test',
  score: 0,
  state: COMMON_STATE.ACTIVE,
};
