import moment from 'moment';
import {firebase} from '~/Firebase';
import {TITLES} from './constants';
import {PROPOSAL_TYPE} from '~/Config';

export const reporterName = (
  user: {firstName: string; lastName: string; uid: string},
  currentUID: string,
) =>
  user?.uid === currentUID
    ? 'you'
    : `${user?.firstName || ''} ${user?.lastName || ''}`;

export const timeReported = (updatedAt: firebase.firestore.Timestamp) =>
  updatedAt.toMillis && moment(updatedAt?.toMillis()).format('MMMM D');

export const getType = (type: string) => {
  switch (type) {
    case PROPOSAL_TYPE.Join:
      return TITLES.membershipRequest;
    case PROPOSAL_TYPE.FundingRequest:
      return TITLES.proposalText;
    default:
      return type;
  }
};
