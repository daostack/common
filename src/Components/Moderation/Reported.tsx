import React from 'react';
import {Text} from 'react-native';
import {string, object, InferProps, shape} from 'prop-types';
import {colors, text} from '~/Theme';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import {reporterName, getType} from './helper';

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
      {`The ${getType(moderation.type).toLowerCase()} was ${
        moderation?.flag
      }${reporterUserName}`}
    </Text>
  );
};

const reportedProps = {
  moderation: shape({
    updatedAt: object,
    flag: string,
    reporter: string,
    type: string.isRequired,
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
