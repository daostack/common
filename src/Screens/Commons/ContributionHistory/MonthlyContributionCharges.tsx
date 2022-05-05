import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ContributionChargesList} from '~/Components/Payment';
import {colors, font, layout} from '~/Theme';
import {ContributionHistoryRouteProps} from '~/Types/navigation';
import {useStore} from '~/Util/hooks/useStore';

const MonthlyContributionCharges = () => {
  const {paymentStore} = useStore('rootStore');
  const navigation = useNavigation();
  const route = useRoute<ContributionHistoryRouteProps>();
  const {commonName, commonId} = route.params;

  const subscriptions = paymentStore.getCommonSubscriptions(commonId);

  useEffect(() => {
    navigation.setOptions({
      title: commonName,
    });
  }, [commonName]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.monthlyContributionCharges}>
        Monthly contribution charges
      </Text>
      <ContributionChargesList subscriptions={subscriptions} />
      <TouchableOpacity style={[layout.btnPrimary, styles.btn]}>
        <Text style={styles.btnText}>Change my monthly contribution</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  monthlyContributionCharges: {
    ...font.primary.bold,
    ...font.fontSize(3),
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 24,
  },
  btn: {
    paddingHorizontal: 8,
    maxHeight: 56,
    marginHorizontal: 24,
  },
  btnText: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.white,
  },
});

export default observer(MonthlyContributionCharges);
