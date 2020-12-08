import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';

import axios from 'axios';
import moment from 'moment';
import auth from '@react-native-firebase/auth';

import {inject, observer} from 'mobx-react';
import {Fade, Placeholder, PlaceholderLine} from 'rn-placeholder';


import {db} from '../../Firebase';
import {colors} from '../../Theme';
import {subscriptionsUrl} from '../../Config';
import {BOTTOM_SHEET_TEMPLATES} from '../../Stores/BottomSheetStore';

import layout from '../../Theme/layout';
import {MonthlyContributionStatus} from '../../Components';

const MonthlyContribution = ({navigation, route, bottomSheetStore}) => {
  const [subscription, setSubscription] = React.useState(null);

  const onCancelConfirm = async () => {
    await axios.post(`${subscriptionsUrl()}/cancel?subscriptionId=${subscription.id}`, null, {
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
      },
    });
  };

  const onCancelClick = () => {
    bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.CANCEL_SUBSCRIPTION, {
      onCancelConfirm,
      commonName: subscription.metadata?.common?.name,
      dueDate: subscription.dueDate.toDate(),
    });
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
      await db
        .collection('subscriptions')
        .doc(route.params?.subscription?.id)
        .onSnapshot((snapshot) => {
          setSubscription(snapshot.data());
        });
    })();
  }, [route.params?.subscription?.id]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>Status</Text>

        {subscription ? (
          <MonthlyContributionStatus status={subscription.status}/>
        ) : (
          <View style={{width: 100}}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100}/>
            </Placeholder>
          </View>
        )}
      </View>

      <View style={styles.row}>
        <Text>
          {(subscription?.status === 'CanceledByUser' && subscription?.dueDate.toDate() > new Date())
            ? 'Cancels on'
            : 'Next payment'
          }
        </Text>


        {subscription ? (
          <Text>
            {subscription.dueDate.toDate() < new Date()
              ? 'In the following days'
              : moment(subscription.dueDate.toDate()).format('DD MMM, YYYY')}
          </Text>
        ) : (
          <View style={{width: 100}}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100}/>
            </Placeholder>
          </View>
        )}
      </View>

      <View style={styles.row}>
        <Text>Amount</Text>


        {subscription ? (
          <Text>
            {subscription.amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
          </Text>
        ) : (
          <View style={{width: 100}}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100}/>
            </Placeholder>
          </View>
        )}
      </View>

      <View style={styles.row}>
        <Text>Subscribed since</Text>


        {subscription ? (
          <Text>
            {moment(subscription.createdAt.toDate()).format('DD MMM, YYYY')}
          </Text>
        ) : (
          <View style={{width: 100}}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100}/>
            </Placeholder>
          </View>
        )}
      </View>

      {subscription && subscription.status === 'CanceledByPaymentFailure' && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            We couldn't charge your credit card and collect your monthly
            contribution. You are no longer a member of the Common,
            but you can always request to join again!
          </Text>
        </View>
      )}

      {subscription && (
        <React.Fragment>
          {['Active', 'PaymentFailed'].some((status) => status === subscription.status) && (
            <TouchableOpacity
              style={styles.button}
              onPress={onCancelClick}
            >
              <Text style={styles.stayText}>
                Cancel payment
              </Text>
            </TouchableOpacity>
          )}

          {['CanceledByUser', 'CanceledByPaymentFailure'].some((status) => status === subscription.status) && subscription.dueDate.toDate() < new Date() && (
            <TouchableOpacity
              style={styles.button}
              onPress={onJoinClick}
            >
              <Text style={styles.stayText}>
                Request to join again
              </Text>
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
          'Active',
          'CanceledByUser',
          'CanceledByPaymentFailure',
          'PaymentFailed',
        ]),
      }),
    }),
  }),

  bottomSheetStore: PropTypes.shape({
    showBottomSheet: PropTypes.func,
  }),

  navigation: PropTypes.object,
};

export default inject('bottomSheetStore')(observer(MonthlyContribution));
