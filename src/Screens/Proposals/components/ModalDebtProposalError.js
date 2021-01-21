import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {colors, font} from '~/Theme';
import ModalCommonDebt from './ModalCommonDebt';

const ModalDebtProposalError = ({onPressClose, amount}) => (
  <ModalCommonDebt onPressClose={onPressClose}>
    <Text style={styles.title}>
      The Common might not have the requested amount
    </Text>
    <Text>
      <Text style={[styles.text, styles.centerText]}>
        {`The Common balance is currently lower than $${amount} (the requested amount). \n
                If the balance would still be insufficient when the proposal is decided, `}
      </Text>
      <Text style={[styles.text, styles.centerText, {fontWeight: 'bold'}]}>
        It will be rejected even if a majority of members approve it
      </Text>
    </Text>
  </ModalCommonDebt>
);

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

export default ModalDebtProposalError;
