import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
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
import ArcService from '../../Services/ArcService';
import {BN} from 'bn.js';

const RequestStep4 = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);

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

  // const isValid = () => {
  //   const result = props.paymentFormStore.isFormValidSelectedFields([
  //     RequestToJoinForm.FIELD_CARD_NAME,
  //     RequestToJoinForm.FIELD_CARD_NUMBER,
  //     RequestToJoinForm.FIELD_EXPIRATION_DATE,
  //     RequestToJoinForm.FIELD_CVV,
  //   ]);
  //   console.log('isValid result -> ', result);
  //
  //   return result;
  // };

  const push = async () => {
    if (props.paymentFormStore.isFormValid()) {
      try {
        // TODO: the data from the form real data
        // remember to save the value of the funding request in dollar cents
        const data = {
          title: `A test proposal on ${Date()}`,
          description: 'Some description',
          files: [],
          images: [],
          links: [], // {title: "title", url: "url"}
          funding: new BN(200), 
        /*
        funding: new BN(
          props.paymentFormStore.form.fields[
            RequestToJoinForm.FIELD_AMOUNT
          ].value,
        ),
        */
        };

        console.log(
          'props.route.params.currDaoId, -> ',
          props.route.params.currDaoId,
        );

        const proposal = await ArcService.getInstance().createRequestToJoin(
          props.route.params.currDaoId,
          data,
        );
        setLoadingMessage(
          `JoinAndQuit Proposal with id ${proposal.id} created!`,
        );

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
              You are contributing{' '}
              {props.paymentFormStore.getChangedFormFieldsJson().amount} to this
              common
            </Text>

            <TextInputField
              label="Credit card number"
              validation={{
                name: RequestToJoinForm.FIELD_CARD_NUMBER,
                formStore: props.paymentFormStore,
                validateRule: 'required|numeric',
              }}
            />

            <TextInputField
              label="Name on card"
              validation={{
                name: RequestToJoinForm.FIELD_CARD_NAME,
                formStore: props.paymentFormStore,
                validateRule: 'required|string',
              }}
            />

            <View
              style={{
                ...layout.content,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'flex-start',
                alignItems: 'flex-start',

                padding: 0,
                flex: 1,
              }}>
              <TextInputField
                viewStyle={{
                  width: '45%',
                }}
                label="Expiration date"
                validation={{
                  name: RequestToJoinForm.FIELD_EXPIRATION_DATE,
                  formStore: props.paymentFormStore,
                  validateRule: 'required|string',
                }}
              />
              <TextInputField
                viewStyle={{
                  width: '45%',
                }}
                label="CVV"
                validation={{
                  name: RequestToJoinForm.FIELD_CVV,
                  formStore: props.paymentFormStore,
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
        <RequestStepActionButton
          title="Pay Now"
          pass={props.paymentFormStore.isFormActionEnabled()}
          onPress={push}
        />
      </SafeAreaView>
    </>
  );
};

export default inject('paymentFormStore')(observer(RequestStep4));
