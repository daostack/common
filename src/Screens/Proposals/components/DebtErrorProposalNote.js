import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import {colors, text} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {func} from 'prop-types';

const DebtErrorProposalNote = ({onPress}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.container}>
      <Icon name="warning" size={16} color={colors.error} />
      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>
          The Common Balance is currently lower than the amount requested
        </Text>
      </View>
      <Icon name="right-arrow" size={16} color={colors.error} />
    </View>
  </TouchableWithoutFeedback>
);

DebtErrorProposalNote.propTypes = {
  onPress: func,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.againstMediumOpacity,
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

export default DebtErrorProposalNote;
