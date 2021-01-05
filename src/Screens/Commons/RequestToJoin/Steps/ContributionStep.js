import React, {useState} from 'react';
import {
  View,
  Text,
} from 'react-native';
import AmountField from '~/Components/FormFields/AmountField';
import {colors, text} from '~/Theme';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import RequestStepActionButton from '../../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import MembershipRequest from '../MembershipRequest';
import RequestStepHeaderTitle from '../RequestStepHeaderTitle';
import {string, func, bool, object, shape, number} from 'prop-types';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';


const ContributionStep = ({navigation, route: {params: {formStores, skipFirstStep, currCommon, currDaoId, refreshFeed}}}) => {
  const [isActionBtnHidden, setIsActionBtnHidden] = useState(true);
  const metadata = currCommon.metadata;
  const isMonthly = metadata.contributionType === 'monthly';
  const personalContributionFormStore = formStores.personalContributionFormStore;

  const onCustomClose = (e) => {
    setIsActionBtnHidden(true);
  };

  const onCustomSelect = (e) => {
    setIsActionBtnHidden(false);
  };

  const onAmountSelected = (amount, index) => {
    personalContributionFormStore.fieldChanged(
      RequestToJoinForm.FIELD_AMOUNT,
      {value: amount, index},
    );
    navigateToRequestStep4();
  };

  const navigateToRequestStep4 = () => {
    const navigate = CommonActions.navigate({
      name: 'BillingDetailsStep',
      params: {
        formStores,
        currDaoId: currDaoId,
        currCommon: currCommon,
        skipFirstStep,
        refreshFeed,
      },
    });
    navigation.dispatch(navigate);
  };

  const push = () => {
    if (personalContributionFormStore.isFormValid()) {
      navigateToRequestStep4();
    }
  };

  const contributeMessage = 'Select the amount you would like to contribute';
  const calcMinFeeToJoin = metadata.minFeeToJoin / 100;
  const minContributionMessage = isMonthly ? `${contributeMessage} each month ($${calcMinFeeToJoin}/mo min.)` : `${contributeMessage} ($${calcMinFeeToJoin} min.)`;

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Billing Details"
      navTitle={currCommon.name}
      currentIndex={3}
      skipFirstStep={skipFirstStep}
      isRequestToJoin={true}
      layoutTitle={<MembershipRequest />}
      requestStepActionButton={
        <RequestStepActionButton
          title="Continue to payment"
          formStore={personalContributionFormStore}
          onPress={push}
          hidden={isActionBtnHidden}
        />
      }
    >
      <View
        style={{
          flex: 1,
          // padding: 24,
          backgroundColor: 'white',
        }}>
        {
          isMonthly
            ? <RequestStepHeaderTitle title="Monthly contribution" subtitle={minContributionMessage} />
            : <RequestStepHeaderTitle title="Personal contribution" subtitle={minContributionMessage} />
        }

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
          minFeeToJoin={metadata.minFeeToJoin / 100}
        />
        <Text style={{
          ...text.regularText,
          textAlign: 'center',
          color: colors.slate,
        }}>
      You can cancel the recurring payment at any time</Text>
      </View>
    </StepDotLayout>
  );
};

ContributionStep.propTypes = {
  navigation: object,
  personalContributionFormStore: shape({
    fieldChanged: func,
    isFormValid: func,
  }),
  route: shape({
    params: shape({
      skipFirstStep: bool,
      currDaoId: string,
      refreshFeed: func,
    }),
  }),
  daoStore: shape({
    dao: shape({
      name: string,
      metadata: shape({
        minFeeToJoin: number,
      }),
    }),
  }),
};

export default ContributionStep;
