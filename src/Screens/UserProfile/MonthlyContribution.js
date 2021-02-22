import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';

import {inject, observer} from 'mobx-react';
import {Fade, Placeholder, PlaceholderLine} from 'rn-placeholder';

import {colors} from '../../Theme';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';

import layout from '../../Theme/layout';
import {MonthlyContributionStatus} from '../../Components';
import {
  ACTIVE,
  CANCELED_BY_PAYMENT,
  CANCELED_BY_USER,
  cancelSubscription,
  getSubscription,
  PAYMENT_FAILED,
} from '~/Services/SubscriptionService';
import {formatCurrency, formatDate} from '../../Util';
import {uiStorePropTypes} from '~/Types/propTypes';

const MonthlyContribution = ({navigation, route, uiStore}) => {
  const [subscription, setSubscription] = React.useState(null);

  const onCancelClick = () => {
    uiStore.bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.CANCEL_SUBSCRIPTION,
      {
        onCancelConfirm: async () => {
          await cancelSubscription(subscription.id);
        },
        commonName: subscription.metadata?.common?.name,
        dueDate: subscription.dueDate.toDate(),
      },
    );
  };

  const onJoinClick = () => {
    navigation.navigate({
      name: 'CommonProfile',
      params: {
        commonId: route.params?.subscription?.metadata?.common?.id,
      },
    });
  };

  React.useEffect(() => {
    navigation.setOptions({
      title: route.params?.subscription?.metadata?.common?.name,
    });
  }, []);

  React.useEffect(() => {
    (async () => {
      await getSubscription(route.params?.subscription?.id, (snap) => {
        setSubscription(snap.data());
      });
    })();
  }, [route.params?.subscription?.id]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>Status</Text>

        {subscription ? (
          <MonthlyContributionStatus
            status={subscription.status}
            dueDate={subscription.dueDate.toDate()}
          />
        ) : (
          <View style={{width: 100}}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100} />
            </Placeholder>
          </View>
        )}
      </View>

      <View style={styles.row}>
        <Text>
          {subscription?.status === CANCELED_BY_USER &&
          subscription?.dueDate.toDate() > new Date()
            ? 'Cancels on'
            : subscription?.status === ACTIVE
            ? 'Next payment'
            : 'Last Payment'}
        </Text>

        {subscription ? (
          <Text>
            {(subscription.status === CANCELED_BY_USER &&
              subscription?.dueDate.toDate() < new Date()) ||
            subscription.status === CANCELED_BY_PAYMENT
              ? formatDate(subscription.lastChargedAt.toDate())
              : subscription.dueDate.toDate() < new Date()
              ? 'In the following days'
              : formatDate(subscription.dueDate.toDate())}
          </Text>
        ) : (
          <View style={{width: 100}}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100} />
            </Placeholder>
          </View>
        )}
      </View>

      <View style={styles.row}>
        <Text>Amount</Text>

        {subscription ? (
          <Text>{formatCurrency(subscription.amount)}</Text>
        ) : (
          <View style={{width: 100}}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100} />
            </Placeholder>
          </View>
        )}
      </View>

      <View style={styles.row}>
        <Text>Subscribed at</Text>

        {subscription ? (
          <Text>{formatDate(subscription.createdAt.toDate())}</Text>
        ) : (
          <View style={{width: 100}}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100} />
            </Placeholder>
          </View>
        )}
      </View>

      {subscription && subscription.status === CANCELED_BY_PAYMENT && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            We couldn't charge your credit card and collect your monthly
            contribution. You are no longer a member of the Common, but you can
            always request to join again!
          </Text>
        </View>
      )}

      {subscription && (
        <React.Fragment>
          {[ACTIVE, PAYMENT_FAILED].some(
            (status) => status === subscription.status,
          ) && (
            <TouchableOpacity style={styles.button} onPress={onCancelClick}>
              <Text style={styles.stayText}>Cancel monthly payment</Text>
            </TouchableOpacity>
          )}

          {[CANCELED_BY_PAYMENT, CANCELED_BY_USER].some(
            (status) => status === subscription.status,
          ) &&
            subscription.dueDate.toDate() < new Date() &&
            subscription.revoked && (
              <TouchableOpacity style={styles.button} onPress={onJoinClick}>
                <Text style={styles.stayText}>Request to join again</Text>
              </TouchableOpacity>
            )}
        </React.Fragment>
      )}
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width * 0.9,
    paddingVertical: 25,

    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },

  descriptionContainer: {
    backgroundColor: '#ff603e22',
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 20,
  },

  descriptionText: {
    color: '#ff603e',
    textAlign: 'center',
  },

  button: {
    ...layout.btnOutline,
    width: Dimensions.get('window').width * 0.9,
    textAlign: 'center',
    maxHeight: 48,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 30,
    color: colors.black,
  },
};

MonthlyContribution.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      subscription: PropTypes.shape({
        metadata: PropTypes.shape({
          common: PropTypes.shape({
            name: PropTypes.string,
            id: PropTypes.string,
          }),
        }),

        id: PropTypes.string,
        dueDate: PropTypes.any,
        amount: PropTypes.number,

        status: PropTypes.oneOf([
          ACTIVE,
          PAYMENT_FAILED,
          CANCELED_BY_USER,
          CANCELED_BY_PAYMENT,
        ]),
      }),
    }),
  }),
  uiStore: uiStorePropTypes,
  navigation: PropTypes.object,
};

export default inject('uiStore')(observer(MonthlyContribution));
