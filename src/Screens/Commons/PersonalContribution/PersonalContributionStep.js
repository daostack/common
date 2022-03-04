import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {omit} from 'lodash';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {v4} from 'uuid';
import AmountField from '~/Components/FormFields/AmountField';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import RequestStepActionButton from '~/Screens/Commons/RequestStepActionButton';
import MembershipRequest from '~/Screens/Commons/RequestToJoin/MembershipRequest';
import RequestStepHeaderTitle from '~/Screens/Commons/RequestToJoin/RequestStepHeaderTitle';
import CardsService from '~/Services/CardsService';
import CommonService from '~/Services/CommonService';
import PaymentService from '~/Services/PaymentsService';
import {colors, text} from '~/Theme';
import {showErrorPopUp} from '~/Util';
import {DOT_INFO_PERSONAL_CONTRIBUTION} from '~/Util/constants/stepperNavigation';
import {useStore} from '~/Util/hooks/useStore';
import {CurrencySymbols} from '~/Util/locale';
import Toast from '~/Util/Toast';
import {CommonCreatedModal} from './CommonCreatedModal';
import logger from '~/Services/Logger';

const PersonalContributionStep = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const {authStore, bottomSheetStore} = useStore('rootStore');

  const {common, formStores} = router.params;

  const [isActionBtnHidden, setIsActionBtnHidden] = useState(true);
  const [newCommonId, setNewCommonId] = useState();
  const metadata = common.metadata;
  const isMonthly = metadata.contributionType === 'monthly';
  const zeroContribution = isMonthly ? false : metadata.zeroContribution;
  const personalContributionFormStore =
    formStores.personalContributionFormStore;
  const minFeeFormatted = common.minFeeToJoinFormatted();

  const onCustomClose = (e) => {
    setIsActionBtnHidden(true);
  };

  const onCustomSelect = (xe) => {
    setIsActionBtnHidden(false);
  };

  const contributeMessage = 'Select the amount you would like to contribute';
  const minContributionMessage = isMonthly
    ? `${contributeMessage} each month (${CurrencySymbols.SHEKEL}${minFeeFormatted}/mo min.)`
    : `${contributeMessage} ${
        minFeeFormatted !== 0
          ? `(${CurrencySymbols.SHEKEL}${minFeeFormatted} min.)`
          : ''
      }`;

  const navigateToRequestStep4 = async () => {
    let cardId = null;
    let link = null;
    Toast.loading('One moment please');
    const card = await CardsService.fetchCardByOwnerId(authStore.userInfo.uid);
    if (card) {
      cardId = card.id;
    } else {
      cardId = v4();
      const {data} = await PaymentService.createBuyerTokenPage(cardId);
      link = data.link;
    }

    navigation.dispatch(
      CommonActions.navigate({
        name: 'PersonalPaymentDetailsStep',
        params: {
          formStores,
          common,
          iFrameLink: link,
          cardId,
        },
      }),
    );
  };

  const createCommonWithoutContribution = async () => {
    navigation.navigate({
      name: 'FullScreenCreationLoader',
      params: {
        title: 'Creating your Common',
        message: 'This might take a couple of minutes.',
      },
    });

    const createCommonResponse = await CommonService.createCommon(
      omit(common, ['metadata', 'minFeeToJoinFormatted']),
    );
    if (createCommonResponse.status === 200) {
      setNewCommonId(createCommonResponse.data.id);
      navigation.pop();
    } else {
      navigation.pop();
      showErrorPopUp(bottomSheetStore, createCommonResponse);
    }
  };

  const onAmountSelected = async (amount, index) => {
    try {
      personalContributionFormStore.fieldChanged(
        RequestToJoinForm.FIELD_AMOUNT,
        {
          value: amount,
          index,
        },
      );

      if (amount > 0) {
        navigateToRequestStep4();
      } else {
        createCommonWithoutContribution();
      }
    } catch (e) {
      logger.log('error -> ', e);
      showErrorPopUp(bottomSheetStore, e);

      navigation.pop();
    }
  };

  const push = () => {
    try {
      if (personalContributionFormStore.isFormValid()) {
        const formData = {
          ...personalContributionFormStore.getFormFieldsJson(),
        };

        if (formData.amount > 0) {
          navigateToRequestStep4();
        } else {
          createCommonWithoutContribution();
        }
      }
    } catch (e) {
      logger.log('error -> ', e);
      showErrorPopUp(bottomSheetStore, e);

      navigation.pop();
    }
  };

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Introduce Yourself"
      navTitle={common.name}
      currentIndex={1}
      headerDotsInfo={DOT_INFO_PERSONAL_CONTRIBUTION}
      layoutTitle={<MembershipRequest />}
      prependedArea={
        <CommonCreatedModal
          isVisible={Boolean(newCommonId)}
          commonId={newCommonId}
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
          navigation={navigation}
          formStore={personalContributionFormStore}
          onCustomSelect={onCustomSelect}
          onCustomClose={onCustomClose}
          onAmountSelected={onAmountSelected}
          minFeeToJoin={common.minFeeToJoinFormatted(true)}
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
