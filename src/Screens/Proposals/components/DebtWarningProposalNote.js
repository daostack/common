import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import {colors, text} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {func} from 'prop-types';

const DebtWarningProposalNote = ({onPress}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.container}>
      <Icon name="warning" size={16} color={colors.mainBlue} />
      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>
          Other proposals might be accepted and make the balance insufficient
        </Text>
      </View>
      <Icon name="right-arrow" size={16} color={colors.mainBlue} />
    </View>
  </TouchableWithoutFeedback>
);

DebtWarningProposalNote.propTypes = {
  onPress: func,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.mainBlueOpacity,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  textContainer: {
    marginHorizontal: 16,
    flex: 1,
  },
  subtitle: {
    ...text.smallBlackText,
    textAlign: 'left',
    fontSize: 12,
  },
});

export default DebtWarningProposalNote;
