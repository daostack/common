import React, {ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {firebase} from '~/Firebase';
import {colors, text} from '~/Theme';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import {getType, reporterName} from './helper';

interface Props {
  moderation?: {
    updatedAt: firebase.firestore.Timestamp;
    flag: string;
    reporter: string;
    type: string;
  };
  currentUID: string;
  reporter?: {
    firstName: string;
    lastName: string;
    uid: string;
  };
  viewerPermission: string;
  showCard: boolean;
}

export const Reported = ({
  moderation,
  reporter,
  currentUID,
  viewerPermission,
  showCard,
}: Props): ReactElement => {
  const reporterUserName =
    viewerPermission === PERMISSIONS.MODERATOR ||
    (!viewerPermission && reporter)
      ? ` by ${reporterName(reporter, currentUID)}`
      : ' by a moderator';

  return (
    <View
      style={[styles.reportContainer, showCard ? {paddingVertical: 4} : {}]}>
      <Text style={[styles.reportText, showCard ? {textAlign: 'center'} : {}]}>
        {`The ${getType(moderation?.type)?.toLowerCase()} was ${
          moderation?.flag
        }${reporterUserName}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  reportContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  reportText: {
    width: '100%',
    fontSize: 15,
    color: colors.grey3,
    ...text.smallBoldGreyText,
    flexWrap: 'wrap',
    textAlign: 'left',
  },
});
