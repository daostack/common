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

export const dateFormat = (updatedAt: firebase.firestore.Timestamp) => {
  const dateTime = moment(new Date(updatedAt?.seconds * 1000));
  const now = moment(new Date());

  const diffMinutes = now.diff(dateTime, 'minutes');
  const diffHours = now.diff(dateTime, 'hours');
  const diffDays = now.diff(dateTime, 'days');
  const diffMonths = now.diff(dateTime, 'months');

  let resultedDiff = diffMonths + 'mo';
  if (diffMonths === 0) {
    resultedDiff = diffDays + 'd';
  }
  if (diffDays === 0) {
    resultedDiff = diffHours + 'h';
  }
  if (diffHours === 0) {
    resultedDiff = diffMinutes + 'min';
  }

  return resultedDiff;
};
