import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {ContributionHistoryRouteProps} from '~/Types/navigation';
import {useStore} from '~/Util/hooks/useStore';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';

const ContributionHistory = () => {
  const {paymentStore, authStore} = useStore('rootStore');
  const navigation = useNavigation();
  const route = useRoute<ContributionHistoryRouteProps>();
  const {commonName, commonId} = route.params;

  const userId = authStore?.userInfo?.uid;

  console.log(paymentStore.getCommonSubscriptions(commonId));

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

  return <View />;
};

export default observer(ContributionHistory);
