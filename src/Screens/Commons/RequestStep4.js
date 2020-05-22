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
import ArcService from '../../Services/ArcService';
import {BN} from 'bn.js';

const RequestStep4 = props => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [pass, setPass] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(null);

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    console.log(height);
    setHeaderHeight(height);
  }, [scrollY]);

  const isValid = () => {
    const result = props.requestToJoinFormStore.isFormValidSelectedFields([
      RequestToJoinForm.FIELD_CARD_NAME,
      RequestToJoinForm.FIELD_CARD_NUMBER,
      RequestToJoinForm.FIELD_EXPIRATION_DATE,
      RequestToJoinForm.FIELD_CVV,
    ]);
    console.log('isValid result -> ', result);
    setPass(result);
    return result;
  };

  const push = async () => {
    //if (isValid()) {

    setLoadingMessage('Creating JoinAndQuit proposal -- please wait');

    try {
      const data = {
        title: `A test proposal on ${Date()}`,
        description: 'Some description',
        files: [],
        images: [],
        links: [], // {title: "title", url: "url"}
        funding: new BN(100000000),
        /*
        funding: new BN(
          props.requestToJoinFormStore.form.fields[
            RequestToJoinForm.FIELD_AMOUNT
          ].value,
        ),
        */
      };
      let instance = await ArcService.getInstance();

      const proposal = await instance.createRequestToJoin(data);
      setLoadingMessage(`JoinAndQuit Proposal with id ${proposal.id} created!`);

      const navigate = CommonActions.navigate({
        name: 'CommonProfile',
        params: {
          showRequestSentModal: true,
        },
      });
      props.navigation.dispatch(navigate);
    } catch (e) {
      console.log(e);
      setLoadingMessage(`${e}`);
    }

    //}
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
          {loadingMessage ? <Text>{loadingMessage}</Text> : null}
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
                validateRule: 'required|numeric',
              }}
            />

            <TextInputField
              label="Name on card"
              validation={{
                name: RequestToJoinForm.FIELD_CARD_NAME,
                formStore: props.requestToJoinFormStore,
                validateRule: 'required|string',
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
                label="Expiration date"
                validation={{
                  name: RequestToJoinForm.FIELD_EXPIRATION_DATE,
                  formStore: props.requestToJoinFormStore,
                  validateRule: 'required|string',
                }}
              />
              <TextInputField
                viewStyle={{alignSelf: 'stretch'}}
                label="CVV"
                validation={{
                  name: RequestToJoinForm.FIELD_CVV,
                  formStore: props.requestToJoinFormStore,
                  validateRule: 'required|numeric',
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

export default inject('requestToJoinFormStore')(observer(RequestStep4));
