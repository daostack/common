import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import AmountField from '~/Components/FormFields/AmountField';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import RequestStepActionButton from '~/Screens/Commons/RequestStepActionButton';
import RequestStepHeaderTitle from '~/Screens/Commons/RequestToJoin/RequestStepHeaderTitle';
import CommonService from '~/Services/CommonService';
import logger from '~/Services/Logger';
import SubscriptionService from '~/Services/SubscriptionService';
import {colors, text} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {MakeContributionRouteProps} from '~/Types/navigation';
import {showErrorPopUp} from '~/Util';
import {formatMinFeeToJoin} from '~/Util/FormatUtil';
import {useStore} from '~/Util/hooks/useStore';
import {CurrencySymbols} from '~/Util/locale';
import Toast from '~/Util/Toast';
import {SuccessfulSentModal} from './components/SuccessfulSentModal';

const MakeContribution = () => {
  const navigation = useNavigation();
  const router = useRoute<MakeContributionRouteProps>();
  const {
    uiStore: {bottomSheetStore},
  } = useStore('rootStore');
  const [isVisible, setVisible] = useState(false);

  const {common, isMonthly, formStores, subscriptionId} = router.params;

  useEffect(() => {
    navigation.setOptions({
      title: common.name,
    });
  }, [common.name]);

  const [isActionBtnHidden, setIsActionBtnHidden] = useState<boolean>(true);
  const zeroContribution = isMonthly ? false : common.metadata.zeroContribution;
  const personalContributionFormStore =
    formStores.personalContributionFormStore;
  const minFeeFormatted = formatMinFeeToJoin({
    zeroContribution: common.metadata.zeroContribution,
    minFeeToJoin: common.metadata.minFeeToJoin,
  });

  const contributeMessage = `Select the amount for your ${
    isMonthly ? 'monthly' : 'one-time'
  } contribution to \n this Сommon. ${
    isMonthly
      ? `The minimum contribution to this Common is ${CurrencySymbols.SHEKEL}${minFeeFormatted} monthly.`
      : 'The funds will be added to the Common balance.'
  }`;

  const onAmountSelected = async (
    amount: number,
    index: number,
  ): Promise<void> => {
    try {
      personalContributionFormStore.fieldChanged(
        RequestToJoinForm.FIELD_AMOUNT,
        {
          value: amount,
          index,
        },
      );
      setIsActionBtnHidden(false);
    } catch (e) {
      logger.log('error -> ', e);
      showErrorPopUp(bottomSheetStore, e);

      navigation.goBack();
    }
  };

  const onCustomClose = () => {
    setIsActionBtnHidden(true);
  };

  const onCustomSelect = () => {
    setIsActionBtnHidden(false);
  };

  const updateMonthlyContributionAmount = async () => {
    const form = personalContributionFormStore.getFormFieldsJson() as {
      amount: number;
    };
    Toast.loading('One moment please');

    const updateSubscriptionAmountResponse =
      await SubscriptionService.updateSubscriptionAmount({
        amount: form.amount * 100,
        subscriptionId: subscriptionId as string,
      });

    Toast.done('Success');
    Toast.hide();

    if (updateSubscriptionAmountResponse.status === 200) {
      setVisible(true);
    } else {
      showErrorPopUp(bottomSheetStore, updateSubscriptionAmountResponse);
    }
  };

  const makeOneTimeContribution = async () => {
    const form = personalContributionFormStore.getFormFieldsJson() as {
      amount: number;
    };
    Toast.loading('One moment please');
    const immediateContributionResponse =
      await CommonService.immediateContribution({
        amount: form.amount * 100,
        commonId: common.id,
        contributionType: common.metadata.contributionType,
        saveCard: true,
      });

    Toast.done('Success');
    Toast.hide();

    if (immediateContributionResponse.status === 200) {
      setVisible(true);
    } else {
      showErrorPopUp(bottomSheetStore, immediateContributionResponse);
    }
  };

  const push = async () => {
    try {
      if (isMonthly) {
        await updateMonthlyContributionAmount();
      } else {
        await makeOneTimeContribution();
      }
    } catch (e) {
      logger.log('error -> ', e);
      showErrorPopUp(bottomSheetStore, e);

      navigation.goBack();
      Toast.hide();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
        scrollEventThrottle={16}>
        <View>
          {isMonthly ? (
            <RequestStepHeaderTitle
              title="Change monthly contribution amount"
              subtitle={contributeMessage}
              subtitleStyle={styles.subtitle}
            />
          ) : (
            <RequestStepHeaderTitle
              title="Make one-time contribution"
              subtitle={contributeMessage}
              subtitleStyle={styles.subtitle}
            />
          )}
          <View style={styles.divider} />
          {isMonthly && (
            <Text style={styles.chargeHint}>
              The change will apply starting from the next charge.
            </Text>
          )}
          <AmountField
            isMonthly={isMonthly}
            formStore={personalContributionFormStore}
            onCustomSelect={onCustomSelect}
            onCustomClose={onCustomClose}
            onAmountSelected={onAmountSelected}
            minFeeToJoin={formatMinFeeToJoin({
              numberValue: true,
              minFeeToJoin: common.metadata.minFeeToJoin,
              zeroContribution: common.metadata.zeroContribution,
            })}
            zeroContribution={zeroContribution}
          />

          {isMonthly && (
            <Text style={styles.monthlyBottomMessage}>
              You can cancel the recurring payment at any time.
            </Text>
          )}
        </View>
      </ScrollView>
      <RequestStepActionButton
        title="Continue to payment"
        formStore={personalContributionFormStore}
        onPress={push}
        hidden={isActionBtnHidden}
      />
      <SuccessfulSentModal
        isVisible={isVisible}
        isMonthly={isMonthly}
        common={common}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  divider: {
    backgroundColor: colors.grey4,
    height: 1,
    marginBottom: 16,
  },
  subtitle: {
    lineHeight: 20,
    marginTop: baseMargin * 2,
    color: colors.greySubtitle,
  },
  chargeHint: {
    ...text.regularText,
    textAlign: 'center',
    color: colors.greySubtitle,
    marginBottom: 24,
  },
  monthlyBottomMessage: {
    ...text.regularText,
    textAlign: 'center',
    color: colors.greySubtitle,
    marginBottom: 10,
  },
});

export default observer(MakeContribution);
