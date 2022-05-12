import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AmountField from '~/Components/FormFields/AmountField';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import RequestStepActionButton from '~/Screens/Commons/RequestStepActionButton';
import {PersonalContributionTitle} from './PersonalContributionTitle';
import RequestStepHeaderTitle from '~/Screens/Commons/RequestToJoin/RequestStepHeaderTitle';
import CommonService from '~/Services/CommonService';
import logger from '~/Services/Logger';
import {colors, text} from '~/Theme';
import {showErrorPopUp} from '~/Util';
import {DOT_INFO_PERSONAL_CONTRIBUTION} from '~/Util/constants/stepperNavigation';
import {formatMinFeeToJoin} from '~/Util/FormatUtil';
import {useStore} from '~/Util/hooks/useStore';
import {CurrencySymbols} from '~/Util/locale';
import Toast from '~/Util/Toast';
import {PersonalContributionsRouteProps} from '../CommonProfile/CommonMembers/types';
import {CommonCreatedModal} from './CommonCreatedModal';

const PersonalContributionStep = () => {
  const navigation = useNavigation();
  const router = useRoute<PersonalContributionsRouteProps>();
  const {
    uiStore: {bottomSheetStore},
  } = useStore('rootStore');

  const {common, formStores} = router.params;

  const [isActionBtnHidden, setIsActionBtnHidden] = useState<boolean>(true);
  const [newCommonId, setNewCommonId] = useState<string>();
  const isMonthly = common.contributionType === 'monthly';
  const zeroContribution = isMonthly ? false : common.zeroContribution;
  const personalContributionFormStore =
    formStores.personalContributionFormStore;
  const minFeeFormatted = formatMinFeeToJoin({
    zeroContribution: common.zeroContribution,
    minFeeToJoin: common.minFeeToJoin,
  });

  const onCustomClose = () => {
    setIsActionBtnHidden(true);
  };

  const onCustomSelect = () => {
    setIsActionBtnHidden(false);
  };

  const contributeMessage = 'Select the amount you would like to contribute';
  const minContributionMessage = isMonthly
    ? `${contributeMessage} each month (${CurrencySymbols.SHEKEL}${minFeeFormatted}/mo min.)`
    : `${contributeMessage} ${
        Number(minFeeFormatted) !== 0
          ? `(${CurrencySymbols.SHEKEL}${minFeeFormatted} min.)`
          : ''
      }`;

  const navigateToRequestStep4 = async () => {
    try {
      const form = personalContributionFormStore.getFormFieldsJson() as {
        amount: number;
      };
      Toast.loading('One moment please');
      if (form.amount === 0) {
        Toast.done('Success');
        Toast.hide();
        setNewCommonId(common.id);
        return;
      }

      const immediateContributionResponse =
        await CommonService.immediateContribution({
          amount: form.amount * 100,
          commonId: common.id,
          contributionType: common.contributionType,
          saveCard: true,
        });

      Toast.done('Success');
      Toast.hide();

      if (immediateContributionResponse.status === 200) {
        if (immediateContributionResponse.data?.link) {
          navigation.dispatch(
            CommonActions.navigate({
              name: 'PersonalPaymentDetailsStep',
              params: {
                common,
                iFrameLink: immediateContributionResponse.data.link,
                paymentId: immediateContributionResponse.data.paymentId,
              },
            }),
          );
        } else {
          setNewCommonId(common.id);
        }
      } else {
        showErrorPopUp(bottomSheetStore, immediateContributionResponse);
      }
    } catch (err) {
      showErrorPopUp(bottomSheetStore, err);
    }
  };

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

      navigateToRequestStep4();
    } catch (e) {
      logger.log('error -> ', e);
      showErrorPopUp(bottomSheetStore, e);

      navigation.pop(2);
    }
  };

  const push = () => {
    try {
      if (personalContributionFormStore.isFormValid()) {
        navigateToRequestStep4();
      }
    } catch (e) {
      logger.log('error -> ', e);
      showErrorPopUp(bottomSheetStore, e);

      navigation.pop(2);
    }
  };

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Introduce Yourself"
      navTitle={common.name}
      currentIndex={1}
      headerDotsInfo={DOT_INFO_PERSONAL_CONTRIBUTION}
      layoutTitle={<PersonalContributionTitle />}
      goBack={() => navigation.pop(2)}
      isFullWidthProgressBar={false}
      prependedArea={
        <CommonCreatedModal
          isVisible={Boolean(newCommonId)}
          commonId={newCommonId as string}
          commonInfo={{
            name: common.name,
            description: common.description,
            image: common.image,
          }}
        />
      }
      requestStepActionButton={
        <RequestStepActionButton
          title="Continue to payment"
          formStore={personalContributionFormStore}
          onPress={push}
          hidden={isActionBtnHidden}
        />
      }>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        {isMonthly ? (
          <RequestStepHeaderTitle
            title="Monthly contribution"
            subtitle={minContributionMessage}
          />
        ) : (
          <RequestStepHeaderTitle
            title="Personal contribution"
            subtitle={minContributionMessage}
          />
        )}
        <View
          style={{
            backgroundColor: colors.grey4,
            height: 1,
            marginBottom: 40,
          }}
        />
        <AmountField
          isMonthly={isMonthly}
          formStore={personalContributionFormStore}
          onCustomSelect={onCustomSelect}
          onCustomClose={onCustomClose}
          onAmountSelected={onAmountSelected}
          minFeeToJoin={formatMinFeeToJoin({
            numberValue: true,
            minFeeToJoin: common.minFeeToJoin,
            zeroContribution: common.zeroContribution,
          })}
          zeroContribution={zeroContribution}
        />

        {isMonthly && (
          <Text style={styles.monthlyBottomMessage}>
            You can cancel the recurring payment at any time.
          </Text>
        )}
      </View>
    </StepDotLayout>
  );
};

const styles = StyleSheet.create({
  monthlyBottomMessage: {
    ...text.regularText,
    textAlign: 'center',
    color: colors.slate,
    marginBottom: 10,
  },
});

export default observer(PersonalContributionStep);
