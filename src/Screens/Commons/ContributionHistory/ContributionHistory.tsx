import {useNavigation, useRoute, CommonActions} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ContributionHistoryRouteProps} from '~/Types/navigation';
import {PersonalContributionFormStore} from '~/Stores/FormStores/MembershipAdmittance';
import {useStore} from '~/Util/hooks/useStore';
import {ContributionList, MonthlyContributionItem} from '~/Components/Payment';
import {PaymentsHistoryInfo} from './components/PaymentsHistoryInfo';
import {colors, font, layout} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';

const ContributionHistory = () => {
  const paymentStore = useStore('paymentStore');
  const navigation = useNavigation();
  const route = useRoute<ContributionHistoryRouteProps>();
  const common = route.params.common;
  const commonName = common?.name;
  const commonId = common?.id;

  const payments = paymentStore.getCommonOneTimePayments(commonId);
  const commonTotalPaymentsAmount =
    paymentStore.getCommonTotalPaymentsAmount(commonId);
  const activeSubscription = paymentStore.getCommonLastSubscriptions(commonId);

  function navigateToMonthlyContributionCharges(): void {
    navigation.dispatch(
      CommonActions.navigate({
        name: NAVIGATION_SCREENS.MONTHLY_CONTRIBUTION_CHARGES,
        params: {
          common: route.params.common,
        },
      }),
    );
  }

  function navigateToMakeContribution(isMonthly: boolean): void {
    const personalContributionFormStore = new PersonalContributionFormStore();

    navigation.dispatch(
      CommonActions.navigate({
        name: NAVIGATION_SCREENS.MAKE_CONTRIBUTION,
        params: {
          common: route.params.common,
          isMonthly,
          ...(isMonthly && {subscriptionId: activeSubscription?.id}),
          formStores: {
            personalContributionFormStore,
          },
        },
      }),
    );
  }

  function navigateToMakeOneTimeContribution(): void {
    navigateToMakeContribution(false);
  }

  function navigateToChangeMonthlyContribution(): void {
    navigateToMakeContribution(true);
  }

  useEffect(() => {
    navigation.setOptions({
      title: commonName,
    });
  }, [commonName]);

  return (
    <SafeAreaView style={styles.container}>
      <PaymentsHistoryInfo amount={commonTotalPaymentsAmount} />
      <Text style={styles.historyTitle}>History</Text>
      {activeSubscription && (
        <MonthlyContributionItem
          dueDate={activeSubscription.dueDate}
          status={activeSubscription.status}
          amount={activeSubscription.amount}
          onPress={navigateToMonthlyContributionCharges}
        />
      )}
      <ContributionList payments={payments} />
      <View style={styles.btnContainer}>
        {activeSubscription && (
          <TouchableOpacity
            style={[layout.btnPrimary, styles.btn]}
            onPress={navigateToChangeMonthlyContribution}>
            <Text style={styles.btnText}>Change my monthly contribution</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={navigateToMakeOneTimeContribution}
          style={[layout.btnOutline, styles.btnOutline, styles.btn]}>
          <Text style={[styles.btnText, styles.btnOutlineText]}>
            Add a one-time contribution
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  historyTitle: {
    ...font.primary.bold,
    ...font.fontSize(3),
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  btnContainer: {
    marginTop: 16,
    marginBottom: 24,
    marginHorizontal: 24,
  },
  btn: {
    paddingHorizontal: 8,
  },
  btnText: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.white,
  },
  btnOutline: {
    borderColor: colors.mainBlue,
    marginTop: baseMargin * 2,
  },
  btnOutlineText: {
    color: colors.mainBlue,
  },
});

export default observer(ContributionHistory);
