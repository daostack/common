import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {HEADER_BUTTON_HEIGHT} from '~/Screens/Commons/components/commonConstants';
import {colors, font} from '~/Theme';

interface RequestToJoinBtnProps {
  requestToJoin: () => void;
}

export const RequestToJoinBtn = (props: RequestToJoinBtnProps) => {
  const {requestToJoin} = props;
  return (
    <TouchableOpacity style={styles.headerButton} onPress={requestToJoin}>
      <Text style={styles.requestToJoin}>Request to join</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    height: HEADER_BUTTON_HEIGHT,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,

    shadowColor: 'rgba(79, 92, 105, 0.1)',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 4,
  },
  requestToJoin: {
    ...font.primary.regular,
    color: colors.white,
    ...font.fontSize(3),
  },
  contribution: {
    ...font.primary.regular,
    fontSize: 16,
    color: colors.white,
  },
});
