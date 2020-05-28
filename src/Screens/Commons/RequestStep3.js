import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import AmountField from '../../Components/FormFields/AmountField';
import {colors} from '../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './RequestStepHeader';
import CreateStepNavigation from './RequestStepNavigation';
import RequestToJoinForm from '../../Components/Forms/RequestToJoinForm';

import CreateStepDotHeader from './RequestStepDotHeader';
import RequestStepActionButton from './RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';

const RequestStep3 = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  // const [ruleCount, setRuleCount] = useState(1);
  // const [ruleTitles, setRuleTitles] = useState([]);
  // const [pass, setPass] = useState(true);
  const [isActionBtnHidden, setIsActionBtnHidden] = useState(true);

  // var ruleBody = [];

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    console.log(height);
    // const height = scrollY.value > 100 ? 125 : 0;
    setHeaderHeight(height);
  }, [scrollY]);

  const onCustomClose = e => {
    setIsActionBtnHidden(true);
  };

  const onCustomSelect = e => {
    setIsActionBtnHidden(false);
  };

  const navigateToRequestStep4 = amount => {
    const navigate = CommonActions.navigate({
      name: 'RequestStep4',
      params: {
        currDaoId: props.route.params.currDaoId,
      },
    });
    props.navigation.dispatch(navigate);
    /*
    props.personalContributionFormStore.fieldChanged(
      RequestToJoinForm.FIELD_AMOUNT,
      amount,
    );
    */
  };

  const push = () => {
    if (props.personalContributionFormStore.isFormValid()) {
      navigateToRequestStep4();
    }
  };

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
          title="Introduce Yourself"
        />
        <CreateStepDotHeader
          title="Personal contribution"
          currentIndex={3}
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
          <CreateStepHeader currentIndex={2} />
          <View
            style={{
              flex: 1,
              // padding: 24,
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                marginTop: 24,
                fontWeight: 'bold',
                fontSize: 18,
                textAlign: 'center',
              }}>
              Personal contribution
            </Text>
            <Text
              style={{marginTop: 12, marginBottom: 23, textAlign: 'center'}}>
              20% of the common members contributed more than $20
            </Text>
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
              onAmountSelected={navigateToRequestStep4}
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

export default inject('personalContributionFormStore')(observer(RequestStep3));
