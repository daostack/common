import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import AmountField from '../../../Components/FormFields/AmountField';
import {colors} from '../../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './RequestStepHeader';
import CreateStepNavigation from './RequestStepNavigation';
import RequestToJoinForm from '../../../Components/Forms/RequestToJoinForm';

import CreateStepDotHeader from './RequestStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import MembershipRequest from './MembershipRequest';
import RequestStepHeaderTitle from './RequestStepHeaderTitle';

const RequestStep3 = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  // const [ruleCount, setRuleCount] = useState(1);
  // const [ruleTitles, setRuleTitles] = useState([]);
  // const [pass, setPass] = useState(true);
  const [isActionBtnHidden, setIsActionBtnHidden] = useState(true);
  const isFirstStepSkipped = props.route.params.skipFirstStep;
  // var ruleBody = [];
  const { name } = props.daoStore.dao;

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

  const onCustomClose = e => {
    setIsActionBtnHidden(true);
  };

  const onCustomSelect = e => {
    setIsActionBtnHidden(false);
    props.personalContributionFormStore.fieldChanged(
      RequestToJoinForm.FIELD_AMOUNT,
      '',
      false,
    );
  };

  const onAmountSelected = amount => {
    props.personalContributionFormStore.fieldChanged(
      RequestToJoinForm.FIELD_AMOUNT,
      amount,
    );
    navigateToRequestStep4();
  };

  const navigateToRequestStep4 = () => {
    const navigate = CommonActions.navigate({
      name: 'RequestStep4',
      params: {
        currDaoId: props.route.params.currDaoId,
        skipFirstStep: isFirstStepSkipped,
      },
    });
    props.navigation.dispatch(navigate);
  };

  const push = () => {
    if (props.personalContributionFormStore.isFormValid()) {
      navigateToRequestStep4();
    }
  };

  const minContributionMessage = `Select the amount you would like to contribute ($${props.daoStore.dao.metadata.minFeeToJoin / 100} min.)`;

  return (
    <>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <CreateStepNavigation
          navigation={props.navigation}
          title={name}
        />
        <CreateStepDotHeader
          title="Personal contribution"
          currentIndex={3}
          isFirstStepSkipped={isFirstStepSkipped}
          navigation={props.navigation}
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
            isFirstStepSkipped={isFirstStepSkipped}
            currentIndex={2}
          />
          <View
            style={{
              flex: 1,
              // padding: 24,
              backgroundColor: 'white',
            }}>
            <RequestStepHeaderTitle title="Personal contribution" subtitle={minContributionMessage} />

            <View
              style={{
                backgroundColor: colors.grey4,
                height: 1,
                marginBottom: 40,
              }}
            />

            <AmountField
              navigation={props.navigation}
              formStore={props.personalContributionFormStore}
              onCustomSelect={onCustomSelect}
              onCustomClose={onCustomClose}
              onAmountSelected={onAmountSelected}
              minFeeToJoin={props.daoStore.dao.metadata.minFeeToJoin / 100}
            />
          </View>
        </ScrollView>
        <RequestStepActionButton
          title="Continue to payment"
          pass={
            props.personalContributionFormStore.form.fields[
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

export default inject(
  'personalContributionFormStore',
  'daoStore',
)(observer(RequestStep3));
