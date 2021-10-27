import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {inject} from 'mobx-react';
import AmountField from '~/Components/FormFields/AmountField';
import {colors, text} from '~/Theme';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import RequestStepActionButton from '../../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import MembershipRequest from '../MembershipRequest';
import RequestStepHeaderTitle from '../RequestStepHeaderTitle';
import {string, func, bool, object, shape} from 'prop-types';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {createRequestToJoin} from '~/Services/ProposalService';
import {showErrorPopUp} from '~/Util';
import {uiStorePropTypes} from '~/Types/propTypes';
import {isIsraelLocale} from '~/Util/locale';

const ContributionStep = ({
  navigation,
  route: {
    params: {formStores, skipFirstStep, currCommon, currDaoId, refreshFeed},
  },
  uiStore,
}) => {
  const [isActionBtnHidden, setIsActionBtnHidden] = useState(true);
  const metadata = currCommon.metadata;
  const isMonthly = metadata.contributionType === 'monthly';
  const zeroContribution = isMonthly ? false : metadata.zeroContribution;
  const personalContributionFormStore =
    formStores.personalContributionFormStore;
  const introduceYourselfFormStore = formStores.introduceYourselfFormStore;

  const onCustomClose = (e) => {
    setIsActionBtnHidden(true);
  };

  const onCustomSelect = (xe) => {
    setIsActionBtnHidden(false);
  };

  const onAmountSelected = (amount, index) => {
    personalContributionFormStore.fieldChanged(RequestToJoinForm.FIELD_AMOUNT, {
      value: amount,
      index,
    });

    if (amount > 0) {
      navigateToRequestStep4();
    } else {
      const formData = {
        ...introduceYourselfFormStore.getFormFieldsJson(),
      };
      const data = {
        description: formData.intro,
        funding: 0,
        commonId: currDaoId,
      };
      if (formData.links) {
        data.links = formData.links;
      }

      navigation.navigate({
        name: 'FullScreenCreationLoader',
        params: {
          title: 'Creating your membership request',
        },
      });

      createRequest(data);
    }
  };

  const createRequest = async (data) => {
    const createRequestToJoinResponse = await createRequestToJoin(
      {
        ...data,
      },
    );

    if (createRequestToJoinResponse.status === 200) {
      const proposalId = createRequestToJoinResponse.data.id;

      navigation.pop();
      const navigate = CommonActions.navigate({
        name: 'CommonProfile',
        params: {
          showRequestSentModal: true,
          createdProposalId: proposalId,
        },
      });

      if (typeof refreshFeed === 'function') {
        refreshFeed();
      }

      navigation.dispatch(navigate);
    } else {
      navigation.pop();
      showErrorPopUp(uiStore.bottomSheetStore, createRequestToJoinResponse);
    }
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
      const formData = {
        ...introduceYourselfFormStore.getFormFieldsJson(),
        ...personalContributionFormStore.getFormFieldsJson(),
      };

      if (formData.amount > 0) {
        navigateToRequestStep4();
      } else {
        const data = {
          description: formData.intro,
          funding: 0,
          commonId: currDaoId,
        };

        if (formData.links) {
          data.links = formData.links;
        }

        navigation.navigate({
          name: 'FullScreenCreationLoader',
          params: {
            title: 'Creating your membership request',
          },
        });

        createRequest(data);
      }
    }
  };

  const contributeMessage = 'Select the amount you would like to contribute';
  const minContributionMessage = isMonthly
    ? `${contributeMessage} each month ($${currCommon.minFeeToJoinFormatted}/mo min.)`
    : `${contributeMessage} ${
        currCommon.minFeeToJoinFormatted !== 0 ? `($${currCommon.minFeeToJoinFormatted} min.)` : ''
      }`;

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle={`${isMonthly ? 'Monthly' : 'Personal'} contribution`}
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
      }>
      <View
        style={{
          flex: 1,
          // padding: 24,
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
          minFeeToJoin={currCommon.minFeeToJoinFormatted}
          zeroContribution={zeroContribution}
        />

        {isMonthly && (
          <Text style={styles.monthlyBottomMessage}>
            You can cancel the recurring payment at any time.
          </Text>
        )}

        {isIsraelLocale && (
          <Text style={styles.monthlyBottomMessage}>
            All contributions are made in U.S. dollars. The actual contribution
            amount in ILS may be different than the amounts estimated above.
          </Text>
        )}
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
  introduceYourselfFormStore: shape({
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
  uiStore: uiStorePropTypes,
};

const styles = StyleSheet.create({
  monthlyBottomMessage: {
    ...text.regularText,
    textAlign: 'center',
    color: colors.slate,
    marginBottom: 10,
  },
});

export default inject('uiStore')(ContributionStep);
