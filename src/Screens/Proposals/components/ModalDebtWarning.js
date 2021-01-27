import {func} from 'prop-types';
import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {colors, font} from '~/Theme';
import ModalCommonDebt from './ModalCommonDebt';

const ModalDebtWarning = ({onPressClose}) => (
  <ModalCommonDebt onPressClose={onPressClose}>
    <Text style={styles.title}>
      The Common might not have the funds you request
    </Text>
    <Text>
      <Text style={[styles.text, styles.centerText]}>
        {`The Common is currently voting on other proposals, and the balance might change before your proposal is decided \n
              If the Common balance is lower than the requested amount, `}
      </Text>
      <Text style={[styles.text, styles.centerText, {fontWeight: 'bold'}]}>
        the proposal will be rejected even if a majority of members approve it
      </Text>
    </Text>
  </ModalCommonDebt>
);

ModalDebtWarning.propTypes = {
  onPressClose: func,
};

const styles = StyleSheet.create({
  title: {
    color: colors.black,
    ...font.primary.bold,
    fontSize: 20,
    marginHorizontal: 56,
    lineHeight: 28,
    textAlign: 'center',
    paddingBottom: 8,
  },
  subtitle: {
    color: colors.black,
    ...font.primary.bold,
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 16,
  },
  text: {
    color: colors.black,
    ...font.primary.regular,
    fontSize: 16,
    marginHorizontal: 50,
    lineHeight: 20,
  },
  centerText: {
    textAlign: 'center',
  },
});

export default ModalDebtWarning;
