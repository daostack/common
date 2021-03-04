import React from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {text, layout, font, colors} from '../../Theme';
import {inject, observer} from 'mobx-react';
import {string} from 'prop-types';
import {PROPOSAL_PAYMENT_STATE} from '~/Util/constants';
import {uiStorePropTypes} from '~/Types/propTypes';

const PaymentFailed = ({uiStore, proposerName, paymentState}) => (
  <View style={styles.container}>
    <View style={styles.body}>
      <Image source={require('../../Assets/closed.png')} style={styles.image} />

      <Text style={styles.textTitle}>
        {paymentState === PROPOSAL_PAYMENT_STATE.FAILED
          ? 'Payment Failed'
          : 'Payment Pending'}
      </Text>

      {paymentState === PROPOSAL_PAYMENT_STATE.FAILED ? (
        <Text style={styles.subtitle}>
          This request was approved by the Common members. However, we weren't
          able to collect the contribution, and the request was cancelled.{' '}
          {proposerName} was not added as a member. If this is your request, you
          may try to join again.
        </Text>
      ) : (
        <Text style={styles.subtitle}>
          This request was approved by the Common members. However, the
          contribution is still pending and {proposerName} was not added as a
          member yet.
        </Text>
      )}

      <TouchableOpacity
        style={styles.dismissButton}
        onPress={() => uiStore.bottomSheetStore.hideBottomSheet()}>
        <Text style={styles.continueEditButtonTxt}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
);

PaymentFailed.propTypes = {
  uiStore: uiStorePropTypes,
  proposerName: string,
  paymentState: string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  body: {
    height: '75%',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  textTitle: {
    ...font.primary.bold,
    ...font.fontSize(4),
  },
  subtitle: {
    ...text.regularText,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    height: '25%',
    aspectRatio: 1,
  },
  publishButtonText: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: 'white',
    width: '100%',
    textAlign: 'center',
  },
  continueEditButtonTxt: {
    ...font.primary.semiBold,
    ...font.fontSize(3),
    textAlign: 'center',
    color: colors.mainBlue,
    width: '100%',
  },
  publishButton: {
    ...layout.btnPrimary,
    flexGrow: 0,
    width: '100%',
    height: 52,
  },
  dismissButton: {
    ...layout.btnOutline,
    flexGrow: 0,
    width: '100%',
    height: 52,
    alignSelf: 'center',
  },
});

export default inject('uiStore')(observer(PaymentFailed));
