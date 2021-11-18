import React from 'react';
import {Text} from 'react-native';
import {colors, text} from '~/Theme';
import {IModerationEntity, MESSAGE_STATUSES, PERMISSIONS} from '~/Types';
import moment from 'moment';
import {getCurrentUser} from '~/Firebase';
import {UserModel} from '~/Stores/Models';
import {upperFirst} from 'lodash';

type Reporter = Pick<UserModel, 'firstName' | 'lastName' | 'uid'>;

export const Reported: React.FC<{
  moderation: IModerationEntity;
  reporter: Reporter;
  viewerPermission: string;
}> = ({moderation, reporter, viewerPermission}) => {
  const reporterUserName =
    viewerPermission === PERMISSIONS.MODERATOR
      ? ` by ${reporterName(reporter)}`
      : '';

  if (
    moderation?.flag === MESSAGE_STATUSES.REPORTED &&
    viewerPermission !== PERMISSIONS.MODERATOR
  ) {
    return <></>;
  }

  return (
    <Text
      style={{fontSize: 15, color: colors.grey3, ...text.smallBoldGreyText}}>
      {`${upperFirst(moderation?.flag)}${reporterUserName} on ${timeReported(
        moderation,
      )}`}
    </Text>
  );
};

// TODO: move these somewhere else one it's clean what object gets here from firestore:
export const timeReported = ({updatedAt}: IModerationEntity) =>
  updatedAt.toMillis && moment(updatedAt?.toMillis()).format('MMMM D');

export const reporterName = ({firstName, lastName, uid}: Reporter) =>
  getCurrentUser()?.uid === uid
    ? 'you'
    : `${firstName || ''} ${lastName || ''}`;
