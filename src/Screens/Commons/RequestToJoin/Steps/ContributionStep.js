import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import {inject} from 'mobx-react';
import AmountField from '~/Components/FormFields/AmountField';
import {colors, text} from '~/Theme';
import CreateStepHeader from '../RequestStepHeader';
import CreateStepNavigation from '../RequestStepNavigation';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import CreateStepDotHeader from '../RequestStepDotHeader';
import RequestStepActionButton from '../../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import MembershipRequest from '../MembershipRequest';
import RequestStepHeaderTitle from '../RequestStepHeaderTitle';
import {string, func, bool, object, shape, number} from 'prop-types';
import ProposalService from '~/Services/ProposalService';
import {showErrorPopUp} from '~/Util';

const {width} = Dimensions.get('window');

const ContributionStep = ({
  navigation,
  route: {
    params: {formStores, skipFirstStep, currCommon, currDaoId, refreshFeed},
  },
  bottomSheetStore,
}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isActionBtnHidden, setIsActionBtnHidden] = useState(true);
  const metadata = currCommon.metadata;
  const isMonthly = metadata.contributionType === 'monthly';
  const personalContributionFormStore =
    formStores.personalContributionFormStore;
  const introduceYourselfFormStore = formStores.introduceYourselfFormStore;

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

  const onCustomClose = (e) => {
    setIsActionBtnHidden(true);
  };

  const onCustomSelect = (e) => {
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
      console.log('DATA', data);
      console.log('AMOUNT', amount);

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
    const createRequestToJoinResponse = await ProposalService.getInstance().createRequestToJoin(
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
      showErrorPopUp(bottomSheetStore, createRequestToJoinResponse);
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
        console.log('DATA', data);
        console.log('AMOUNT', formData.amount);

        navigation.navigate({
          name: 'FullScreenCreationLoader',
          params: {
            title: 'Creating your membership request',
          },
        });
      }

      //navigateToRequestStep4();
    }
  };

  const contributeMessage = 'Select the amount you would like to contribute';
  const calcMinFeeToJoin = metadata.minFeeToJoin / 100;
  const minContributionMessage = isMonthly
    ? `${contributeMessage} each month ($${calcMinFeeToJoin}/mo min.)`
    : `${contributeMessage} ($${calcMinFeeToJoin} min.)`;

  return (
    <>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <CreateStepNavigation navigation={navigation} title={currCommon.name} />
        <CreateStepDotHeader
          title="Personal contribution"
          currentIndex={3}
          isFirstStepSkipped={skipFirstStep}
          navigation={navigation}
          headerHeight={headerHeight}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          width={width}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}>
          <MembershipRequest />

          <CreateStepHeader
            isFirstStepSkipped={skipFirstStep}
            currentIndex={2}
          />
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
              minFeeToJoin={metadata.minFeeToJoin / 100}
            />
            <Text
              style={{
                ...text.regularText,
                textAlign: 'center',
                color: colors.slate,
              }}>
              You can cancel the recurring payment at any time
            </Text>
          </View>
        </ScrollView>
        <RequestStepActionButton
          title="Continue to payment"
          formStore={personalContributionFormStore}
          onPress={push}
          hidden={isActionBtnHidden}
        />
      </SafeAreaView>
    </>
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
  daoStore: shape({
    dao: shape({
      name: string,
      metadata: shape({
        minFeeToJoin: number,
      }),
    }),
  }),
  bottomSheetStore: object,
};

export default inject('bottomSheetStore', 'userStore')(ContributionStep);
