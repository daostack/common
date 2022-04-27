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
  const dateTime = updatedAt?.seconds * 1000;
  const now = new Date().getTime();

  const diffMinutes = Math.floor((now - dateTime) / (1000 * 60));
  const diffHours = Math.floor((now - dateTime) / (1000 * 60 * 60));
  const diffDays = Math.floor((now - dateTime) / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor((now - dateTime) / (1000 * 60 * 60 * 24 * 30));

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
