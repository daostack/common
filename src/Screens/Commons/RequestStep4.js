import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import TextInputField from '../../Components/FormFields/TextInputField';
import {colors, layout, text} from '../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './RequestStepHeader';
import CreateStepNavigation from './RequestStepNavigation';
import RequestToJoinForm from '../../Components/Forms/RequestToJoinForm';

import CreateStepDotHeader from './RequestStepDotHeader';
import RequestStepActionButton from './RequestStepActionButton';

import {CommonActions} from '@react-navigation/native';

const RequestStep4 = props => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [ruleCount, setRuleCount] = useState(1);
  // const [ruleTitles, setRuleTitles] = useState([]);
  const [pass, setPass] = useState(true);
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
    const titles = [...Array(ruleCount).keys()].map(x => `ruleTitles_${x}`);
    const bodys = [...Array(ruleCount).keys()].map(x => `ruleBody_${x}`);

    const result = props.requestToJoinFormStore.isFormValidSelectedFields([
      RequestToJoinForm.ACTION,
      ...titles,
      ...bodys,
    ]);
    setPass(result);
    return result;
  };

  const push = () => {
    /*
    const vaild = isValid();
    if (vaild) {
      props.navigation.navigate('CreateStep4');
      console.log(props.requestToJoinFormStore.getChangedFormFieldsJson());
    }
    */

    const navigate = CommonActions.navigate({
      name: 'CommonProfile',
      params: {
        showRequestSentModal: true,
      },
    });
    props.navigation.dispatch(navigate);
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
          title="Personal contribution"
        />
        <CreateStepDotHeader
          title="Payment"
          currentIndex={4}
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
          <CreateStepHeader currentIndex={3} />
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
              Payment
            </Text>
            <Text
              style={{marginTop: 12, marginBottom: 23, textAlign: 'center'}}>
              You are contributing $25 to this common
            </Text>

            <TextInputField
              label="Credit card number"
              validation={{
                name: RequestToJoinForm.FIELD_CARD_NUMBER,
                formStore: props.requestToJoinFormStore,
                validateRule: 'string',
              }}
            />

            <TextInputField
              label="Name on card"
              validation={{
                name: RequestToJoinForm.FIELD_CARD_NAME,
                formStore: props.requestToJoinFormStore,
                validateRule: 'string',
              }}
            />

            <View
              style={{
                ...layout.content,
                flexDirection: 'row',
                justifyContent: 'space-between',
                ...{
                  padding: 0,
                  alignSelf: 'stretch',
                },
              }}>
              <TextInputField
                viewStyle={{alignSelf: 'stretch'}}
                label="Expiration date                 "
                validation={{
                  name: RequestToJoinForm.FIELD_CARD_NAME,
                  formStore: props.requestToJoinFormStore,
                  validateRule: 'string',
                }}
              />
              <TextInputField
                viewStyle={{alignSelf: 'stretch'}}
                label="CVV                                 "
                validation={{
                  name: RequestToJoinForm.FIELD_CARD_NAME,
                  formStore: props.requestToJoinFormStore,
                  validateRule: 'string',
                }}
              />
            </View>

            <Text
              style={{
                ...text.blackText,
                ...{color: colors.grey2, textAlign: 'center'},
              }}>
              Your money will be refunded if the common does not approve your
              request or meet the funding goal
            </Text>
          </View>
        </ScrollView>
        <RequestStepActionButton title="Pay Now" pass={pass} onPress={push} />
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

export default inject('requestToJoinFormStore')(observer(RequestStep4));
