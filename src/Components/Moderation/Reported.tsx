import React from 'react';
import {firebase} from '~/Firebase';
import {Text} from 'react-native';
import {string, object, InferProps, shape} from 'prop-types';
import {colors, text} from '~/Theme';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import moment from 'moment';
const _ = require('lodash');

export const Reported: React.FC<InferProps<typeof reportedProps>> = ({
  moderation,
  reporter,
  currentUID,
  viewerPermission,
}) => {
  const reporterUserName =
    viewerPermission === PERMISSIONS.MODERATOR
      ? ` by ${reporterName(reporter, currentUID)}`
      : ' by a moderator';

  return (
    <Text
      style={{fontSize: 15, color: colors.grey3, ...text.smallBoldGreyText}}>
      {`${_.upperFirst(moderation?.flag)}${reporterUserName} on ${timeReported(
        moderation?.updatedAt,
      )}`}
    </Text>
  );
};

export const timeReported = (updatedAt: firebase.firestore.Timestamp) =>
  updatedAt.toMillis && moment(updatedAt?.toMillis()).format('MMMM D');

export const reporterName = (
  user: {firstName: string; lastName: string; uid: string},
  currentUID: string,
) =>
  user?.uid === currentUID
    ? 'you'
    : `${user?.firstName || ''} ${user?.lastName || ''}`;

const reportedProps = {
  moderation: shape({
    updatedAt: object,
    flag: string,
    reporter: string,
  }),
  currentUID: string,
  reporter: shape({
    firstName: string,
    lastName: string,
    uid: string,
  }),
  viewerPermission: string,
};

Reported.propTypes = reportedProps;
