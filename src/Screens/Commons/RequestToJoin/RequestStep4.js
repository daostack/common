import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import TextInputField from '~/Components/FormFields/TextInputField';
import {colors, layout, text} from '~/Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './RequestStepHeader';
import CreateStepNavigation from './RequestStepNavigation';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import CreateStepDotHeader from './RequestStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import ArcService from '~/Services/ArcService';
import {preauthorizePayment} from '~/Services/MangopayService';
import RequestStepHeaderTitle from './RequestStepHeaderTitle';
import {showErrorPopUp} from '~/Util';

const RequestStep4 = ({navigation, ...props}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const isFirstStepSkipped = props.route.params.skipFirstStep;

  const {name} = props.daoStore.dao;

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

  const push = async () => {
    if (props.paymentFormStore.isFormValid()) {
      try {
        const formData = {
          ...props.introduceYourselfFormStore.getFormFieldsJson(),
          ...props.personalContributionFormStore.getFormFieldsJson(),
          ...props.paymentFormStore.getFormFieldsJson(),
        };

        let data = {
          title: `request to join ${props.route.params.currDaoId} by ${props.userStore.userInfo.ethereumAddress}`,
          description: formData.about_me,
          links: formData.links,
          funding: formData.amount * 100,
          preAuthId: false,
        };

        const cardData = {
          cardNumber: formData.card_number,
          cvv: formData.cvv,
          expDate: formData.expiration_date.replace('/', ''),
        };

        navigation.navigate({name: 'FullScreenCreationLoader', params: {title: 'Creating your membership request'}});

        if (Number(data.funding) > 0) {
          const preAuthId = await preauthorizePayment(cardData, Number(data.funding), navigation);
          data = {...data, preAuthId};
          console.log('PREAUTH ID', preAuthId);
        }

        const proposalId = await ArcService.getInstance().createRequestToJoin(
          props.route.params.currDaoId,
          data,
        );

        navigation.pop();

        const navigate = CommonActions.navigate({
          name: 'CommonProfile',
          params: {
            showRequestSentModal: true,
            createdProposalId: proposalId,
          },
        });
        navigation.dispatch(navigate);
      } catch (e) {
        navigation.pop();
        showErrorPopUp(props.bottomSheetStore, e?.response?.data?.error ? e.response.data.error : e.message);
      }
    }
  };

  const subtitle = `You are contributing $${props.personalContributionFormStore.form.fields.amount?.value} to this common`;

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
          title={name}
        />
        <CreateStepDotHeader
          title="Payment"
          currentIndex={4}
          isFirstStepSkipped={isFirstStepSkipped}
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
          <CreateStepHeader
            isFirstStepSkipped={isFirstStepSkipped}
            currentIndex={3}
          />
          <View
            style={{
              flex: 1,
              // padding: 24,
              backgroundColor: 'white',
            }}>
            <RequestStepHeaderTitle title="Payment" subtitle={subtitle} />
            <TextInputField
              label="Credit card number"
              value={/* __DEV__ ? */ 4970104100876299}
              editable={false}
              validation={{
                name: RequestToJoinForm.FIELD_CARD_NUMBER,
                formStore: props.paymentFormStore,
                validateRule: 'required|numeric',
              }}
            />

            <TextInputField
              label="Name on card"
              value={/* __DEV__ ? */ 'Tester Tester'}
              editable={false}
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
                value={/* __DEV__ ?  */'10/20'}
                placeholderText="MM/YY"
                editable={false}
                validation={{
                  name: RequestToJoinForm.FIELD_EXPIRATION_DATE,
                  formStore: props.paymentFormStore,
                  validateRule: [
                    'required',
                    'string',
                    'regex:/^(0[1-9]|1[0-2])/?([0-9]{2})$/',
                  ],
                }}
              />
              <TextInputField
                viewStyle={{
                  width: '45%',
                }}
                label="CVV"
                value={/* __DEV__ ? */ 123}
                editable={false}
                validation={{
                  name: RequestToJoinForm.FIELD_CVV,
                  formStore: props.paymentFormStore,
                  validateRule: 'required|numeric|digits_between:3,4',
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

export default inject(
  'bottomSheetStore',
  'introduceYourselfFormStore',
  'personalContributionFormStore',
  'paymentFormStore',
  'userStore',
  'daoStore'
)(observer(RequestStep4));
