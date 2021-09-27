import React from 'react';
import {Text} from 'react-native';
import {getLastReporterInfo} from '~/Util/report';
import {string, object, shape} from 'prop-types';
import {colors, text} from '~/Theme';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import {ModerationType, REPORT_FLAG} from '~/Graphql/Report';
import moment from 'moment';
import {upperFirst} from 'lodash';

interface ReportedProps {
  moderation: ModerationType;
  currentUID: string;
  viewerPermission: string;
}

export const Reported = ({
  moderation,
  currentUID,
  viewerPermission,
}: ReportedProps) => {
  const moderatorInfo = getLastReporterInfo(moderation);
  const reporterUserName =
    moderatorInfo && viewerPermission === PERMISSIONS.MODERATOR
      ? ` by ${reporterName(currentUID, moderatorInfo)}`
      : '';

  if (
    moderation?.flag === REPORT_FLAG.Reported &&
    viewerPermission !== PERMISSIONS.MODERATOR
  ) {
    return <></>;
  }

  return (
    <Text
      style={{fontSize: 15, color: colors.grey3, ...text.smallBoldGreyText}}>
      {`${upperFirst(moderation?.flag)}${reporterUserName} ${
        moderation?.updatedAt ? `on ${timeReported(moderation?.updatedAt)}` : ''
      }`}
    </Text>
  );
};

export const timeReported = (updatedAt: Date) =>
  moment(updatedAt).format('MMMM D');

export const reporterName = (
  currentUID: string,
  user?: {firstName: string; lastName: string; uid: string},
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
