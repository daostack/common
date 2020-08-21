import React from 'react';
import {
  Text, TouchableOpacity, StyleSheet, View,
} from 'react-native';
import { layout, colors, font } from '../../Theme';

const RequestStepActionButton = (props) => {
  let actionBtnStyle = styles.actionBtnContainer;

  if (props.hidden) {
    actionBtnStyle = { ...actionBtnStyle, ...{ display: 'none' } };
  }

  return (
    <View style={actionBtnStyle}>
      <TouchableOpacity
        style={[
          styles.continueButton,
          { backgroundColor: props.pass ? colors.mainBlue : colors.grey3 },
        ]}
        onPress={props.onPress}
      >
        <Text style={styles.continueButtonText}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  continueButton: {
    width: '100%',
    height: 48,
    borderRadius: 32,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
  continueButtonText: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: 'white',
  },
  actionBtnContainer: {
    ...layout.content,
    backgroundColor: colors.white,
    shadowColor: 'rgba(79, 92, 105, 0.1)',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 2,
  },
});

export default RequestStepActionButton;
