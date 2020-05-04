import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
  TextInput,
} from 'react-native';
import TextInputField from '../../Components/FormFields/TextInputField';
import AmountField from '../../Components/FormFields/AmountField';
import {colors} from '../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './RequestStepHeader';
import CreateStepNavigation from './RequestStepNavigation';
import RequestToJoinForm from '../../Components/Forms/RequestToJoinForm';
import JoinAmount from '../../Components/Commons/JoinAmount';

import CreateStepDotHeader from './RequestStepDotHeader';
import RequestStepActionButton from './RequestStepActionButton';

const RequestStep3 = props => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [ruleCount, setRuleCount] = useState(1);
  const [ruleTitles, setRuleTitles] = useState([]);
  const [pass, setPass] = useState(true);
  const [isActionBtnHidden, setIsActionBtnHidden] = useState(true);

  // var ruleBody = [];

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    console.log(height);
    // const height = scrollY.value > 100 ? 125 : 0;
    setHeaderHeight(height);
  }, [scrollY]);

  const handleRuleTitles = (x, text) => {
    // props.requestToJoinFormStore.registerFormField(`ruleTitles_${x}`, 'string');
    // console.log(props.requestToJoinFormStore);
    props.requestToJoinFormStore.registerFormField(`ruleTitles_${x}`, 'string');
    props.requestToJoinFormStore.fieldChanged(`ruleTitles_${x}`, text);
    // ruleTitles[x] = text;
    // console.log(x, text, ruleTitles);
  };

  const handleRuleBody = (x, text) => {
    props.requestToJoinFormStore.registerFormField(`ruleBody_${x}`, 'string');
    // ruleBody[x] = text;
    // console.log(ruleBody);
    props.requestToJoinFormStore.fieldChanged(`ruleBody_${x}`, text);
  };

  const isValid = () => {
    props.requestToJoinFormStore.isFormValid();

    const result = props.requestToJoinFormStore.isFormValidSelectedFields([
      RequestToJoinForm.FIELD_AMOUNT,
    ]);

    return result;
  };

  const onCustomClose = e => {
    setIsActionBtnHidden(true);
  };

  const onCustomSelect = e => {
    setIsActionBtnHidden(false);
  };

  const push = () => {
    const vaild = isValid();
    if (vaild) {
      props.navigation.navigate('RequestStep4');
      console.log(props.requestToJoinFormStore.getChangedFormFieldsJson());
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
              formStore={props.requestToJoinFormStore}
              onCustomSelect={onCustomSelect}
              onCustomClose={onCustomClose}
            />
          </View>
        </ScrollView>
        <RequestStepActionButton
          title="Continue to payment"
          pass={
            props.requestToJoinFormStore.form.fields[
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

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: colors.white,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 2,
    height: 50,
  },
  placeholderText: {
    color: colors.grey3,
  },
  text: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.black,
  },
  readMoreButton: {
    fontSize: 12,
    // fontWeight: '700',
    color: colors.grey3,
  },
  continueButton: {
    width: '100%',
    height: 48,
    borderRadius: 32,
    marginTop: 45,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
});

export default inject('requestToJoinFormStore')(observer(RequestStep3));
