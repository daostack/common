import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import {layout, colors, font} from '~/Theme';
import {string, func, bool, object} from 'prop-types';
import {observer} from 'mobx-react';

const RequestStepActionButton = ({hidden, pass, formStore, onPress, title}) => {
  let actionBtnStyle = styles.actionBtnContainer;

  if (hidden) {
    actionBtnStyle = {...actionBtnStyle, display: 'none'};
  }

  const isButtonEnabled = () =>
    formStore ? formStore.isFormActionEnabled() : pass;

  return (
    <View style={actionBtnStyle}>
      <TouchableOpacity
        style={{
          ...styles.continueButton,
          backgroundColor: isButtonEnabled() ? colors.mainBlue : colors.grey3,
        }}
        onPress={onPress}>
        <Text style={styles.continueButtonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

RequestStepActionButton.propTypes = {
  hidden: bool,
  pass: bool,
  onPress: func,
  title: string,
  formStore: object,
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

export default observer(RequestStepActionButton);
