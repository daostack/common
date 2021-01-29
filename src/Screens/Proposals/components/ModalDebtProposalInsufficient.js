import {func} from 'prop-types';
import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {colors, font} from '~/Theme';
import ModalCommonDebt from './ModalCommonDebt';

const ModalDebtProposalInsufficient = ({onPressClose}) => (
  <ModalCommonDebt onPressClose={onPressClose}>
    <Text style={styles.title}>Insufficient balance</Text>
    <Text style={[styles.text, styles.centerText]}>
      <Text>
        {
          'The proposal was approved by the Common members, but the Common balance was insufficient for the requested amount, '
        }
      </Text>
      <Text style={{fontWeight: 'bold'}}>and the proposal was cancelled</Text>
    </Text>
  </ModalCommonDebt>
);

ModalDebtProposalInsufficient.propTypes = {
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
    marginHorizontal: 30,
    lineHeight: 20,
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
});

export default ModalDebtProposalInsufficient;
