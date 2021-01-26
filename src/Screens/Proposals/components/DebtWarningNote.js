import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import {colors, font} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {func} from 'prop-types';

const DebtWarningNote = ({onPress}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.container}>
      <Icon name="warning" size={16} color={colors.mainBlue} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Please note:</Text>
        <Text style={styles.subtitle}>
          Other proposals might be accepted and make the balance insufficient
          for the amount requested
        </Text>
      </View>
      <Icon name="right-arrow" size={16} color={colors.mainBlue} />
    </View>
  </TouchableWithoutFeedback>
);

DebtWarningNote.propTypes = {
  onPress: func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBlueOpacity,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  textContainer: {
    marginHorizontal: 16,
  },
  title: {
    ...font.primary.bold,
    marginBottom: 5,
    color: colors.slate,
    fontSize: 14,
  },
  subtitle: {
    ...font.primary.regular,
    color: colors.slate,
    fontSize: 14,
  },
});

export default DebtWarningNote;
