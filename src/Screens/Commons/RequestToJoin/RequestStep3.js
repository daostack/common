import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import AmountField from '~/Components/FormFields/AmountField';
import {colors, text} from '~/Theme';
import {observer, inject} from 'mobx-react';
import CreateStepHeader from './RequestStepHeader';
import CreateStepNavigation from './RequestStepNavigation';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import CreateStepDotHeader from './RequestStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import MembershipRequest from './MembershipRequest';
import RequestStepHeaderTitle from './RequestStepHeaderTitle';
import {string, func, bool, object, shape, number} from 'prop-types';
const {width} = Dimensions.get('window');

const RequestStep3 = ({navigation, personalContributionFormStore, route: {params: {skipFirstStep, currCommon, currDaoId}}}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isActionBtnHidden, setIsActionBtnHidden] = useState(true);
  const metadata = currCommon.metadata;
  const isMonthly = metadata.contribution === 'monthly';

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
    personalContributionFormStore.fieldChanged(
      RequestToJoinForm.FIELD_AMOUNT,
      '',
      false,
    );
  };

  const onAmountSelected = (amount) => {
    personalContributionFormStore.fieldChanged(
      RequestToJoinForm.FIELD_AMOUNT,
      amount,
    );
    navigateToRequestStep4();
  };

  const navigateToRequestStep4 = () => {
    const navigate = CommonActions.navigate({
      name: 'RequestStep4',
      params: {
        currDaoId: currDaoId,
        currCommon: currCommon,
        skipFirstStep: skipFirstStep,
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
  const minContributionMessage = isMonthly ? `${contributeMessage} ($${calcMinFeeToJoin} /mo)` : `${contributeMessage} ($${calcMinFeeToJoin} min.)`;

  return (
    <>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <CreateStepNavigation
          navigation={navigation}
          title={currCommon.name}
        />
        <CreateStepDotHeader
          title="Personal contribution"
          currentIndex={3}
          skipFirstStep={skipFirstStep}
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
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: scrollY}}},
          ])}>
          <MembershipRequest />

          <CreateStepHeader
            skipFirstStep={skipFirstStep}
            currentIndex={2}
          />
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
        </ScrollView>
        <RequestStepActionButton
          title="Continue to payment"
          pass={
            personalContributionFormStore.form.fields[
              RequestToJoinForm.FIELD_AMOUNT
            ]?.error
              ? false
              : true
          }
          onPress={push}
          hidden={isActionBtnHidden}
        />
      </SafeAreaView>
    </>
  );
};

RequestStep3.propTypes = {
  navigation: object,
  personalContributionFormStore: shape({
    fieldChanged: func,
    isFormValid: func,
  }),
  route: shape({
    params: shape({
      skipFirstStep: bool,
      currDaoId: string,
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

export default inject(
  'personalContributionFormStore',
)(observer(RequestStep3));
