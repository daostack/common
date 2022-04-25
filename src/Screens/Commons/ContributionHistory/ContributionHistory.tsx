import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {ContributionHistoryRouteProps} from '~/Types/navigation';
import {useStore} from '~/Util/hooks/useStore';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {ContributionItem} from '~/Components/Payment';
import {PaymentsHistoryInfo} from './PaymentsHistoryInfo';

const ContributionHistory = () => {
  const {paymentStore, authStore} = useStore('rootStore');
  const navigation = useNavigation();
  const route = useRoute<ContributionHistoryRouteProps>();
  const {commonName, commonId} = route.params;
  const commonTotalPaymentsAmount = paymentStore.getCommonTotalPaymentsAmount(
    commonId,
  );

  const userId = authStore?.userInfo?.uid;

  console.log(paymentStore.getCommonTotalPaymentsAmount(commonId));

  useEffect(() => {
    let unsubscribeToUserPayments: FirestoreUnsubscribeFn;
    let unsubscribeToUserSubscriptions: FirestoreUnsubscribeFn;
    if (userId) {
      unsubscribeToUserPayments = paymentStore.subscribeToUserPayments(userId);
      unsubscribeToUserSubscriptions = paymentStore.subscribeToUserSubscriptions(
        userId,
      );
    }

    return () => {
      unsubscribeToUserPayments && unsubscribeToUserPayments();
      unsubscribeToUserSubscriptions && unsubscribeToUserSubscriptions();
    };
  }, [userId]);

  useEffect(() => {
    navigation.setOptions({
      title: commonName,
    });
  }, [commonName]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <PaymentsHistoryInfo amount={commonTotalPaymentsAmount} />
      <ContributionItem
        createdAt={
          paymentStore.getCommonOneTimePayments(commonId)[0]?.createdAt
        }
        amount={
          paymentStore.getCommonOneTimePayments(commonId)[0]?.amount.amount
        }
      />
    </View>
  );
};

export default observer(ContributionHistory);
