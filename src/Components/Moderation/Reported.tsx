import React from 'react';
import {firebase} from '~/Firebase';
import {Text} from 'react-native';
import {string, object, InferProps, shape} from 'prop-types';
import {colors, text} from '~/Theme';
import moment from 'moment';
const _ = require('lodash');

export const Reported: React.FC<InferProps<typeof reportedProps>> = ({
  moderation,
  reporter,
  currentUID,
}) => (
  <Text style={{fontSize: 15, color: colors.grey3, ...text.smallBoldGreyText}}>
    {`${_.upperFirst(moderation?.flag)} by ${reporterName(
      reporter,
      currentUID,
    )} on ${timeReported(moderation?.updatedAt)}`}
  </Text>
);

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
};

Reported.propTypes = reportedProps;
