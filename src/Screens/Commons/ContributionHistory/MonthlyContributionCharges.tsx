import {useNavigation, useRoute, CommonActions} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ContributionChargesList} from '~/Components/Payment';
import {colors, font, layout} from '~/Theme';
import {PersonalContributionFormStore} from '~/Stores/FormStores/MembershipAdmittance';
import {ContributionHistoryRouteProps} from '~/Types/navigation';
import {useStore} from '~/Util/hooks/useStore';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';

const MonthlyContributionCharges = () => {
  const {paymentStore} = useStore('rootStore');
  const navigation = useNavigation();
  const route = useRoute<ContributionHistoryRouteProps>();
  const {
    common: {name: commonName, id: commonId},
  } = route.params;

  const activeSubscription = paymentStore.getCommonLastSubscriptions(commonId);
  const subscriptions = paymentStore.getCommonSubscriptions(commonId);

  function navigateToMakeContribution(): void {
    const personalContributionFormStore = new PersonalContributionFormStore();

    navigation.dispatch(
      CommonActions.navigate({
        name: NAVIGATION_SCREENS.MAKE_CONTRIBUTION,
        params: {
          common: route.params.common,
          isMonthly: true,
          subscriptionId: activeSubscription?.id,
          formStores: {
            personalContributionFormStore,
          },
        },
      }),
    );
  }

  function navigateToPaymentDetails(): void {
    navigation.dispatch(
      CommonActions.navigate({
        name: NAVIGATION_SCREENS.CONTRIBUTION_PAYMENT_DETAILS,
        params: {
          commonName,
        },
      }),
    );
  }

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
      <ContributionChargesList subscriptions={subscriptions}>
        <TouchableOpacity
          style={styles.editPaymentDetailsBtn}
          onPress={navigateToPaymentDetails}>
          <Text style={styles.editPaymentDetailsBtnText}>
            Edit payment details
          </Text>
        </TouchableOpacity>
      </ContributionChargesList>

      <TouchableOpacity
        onPress={navigateToMakeContribution}
        style={[layout.btnPrimary, styles.btn]}>
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
  editPaymentDetailsBtn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  editPaymentDetailsBtnText: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.mainBlue,
  },
  btnText: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.white,
  },
});

export default observer(MonthlyContributionCharges);
