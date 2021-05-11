import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Bold} from '~/Components/Text/Bold';
import {ISubscriptionEntity} from '~/Firebase/Databasee/EntityTypes/ISubscriptionEntity';
import {colors} from '~/Theme';

export const PaymentFailureMessageBox = ({
  subscription,
  isExpired,
  expDate,
}: {
  subscription: ISubscriptionEntity;
  isExpired: boolean;
  expDate: object;
}) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>
      We couldn't charge your card and collect{'\n'}your monthly contribution.
      {'\n'}
    </Text>

    <Text style={styles.errorText}>
      {!isExpired && !subscription?.revoked ? (
        <Bold
          boldText={`Please update your payment details before\n${expDate} to remain a member.`}
        />
      ) : (
        'You are no longer a member of the Common,\nbut you can always request to join again!'
      )}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.9,
    paddingVertical: 25,
    borderRadius: 14,
    backgroundColor: colors.redLightish,
    marginTop: 20,
  },
  errorText: {
    alignSelf: 'center',
    fontSize: 16,
    textAlign: 'center',
    color: colors.error,
  },
});
