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
import CreateStepHeader from './RequestStepHeader';
import CreateStepNavigation from './RequestStepNavigation';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import CreateStepDotHeader from './RequestStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import ArcService from '~/Services/ArcService';
import {createCard, ping} from '~/Services/CirclePayService';
import {preauthorizePayment} from '~/Services/MangopayService';
import RequestStepHeaderTitle from './RequestStepHeaderTitle';
import {showErrorPopUp} from '~/Util';
import {string, func, bool, object, shape} from 'prop-types';
const {width} = Dimensions.get('window');

const RequestStep4 = ({navigation,
  route: {
    params: {skipFirstStep, currCommon, currDaoId, refreshFeed},
  },
  userStore: {userInfo},
  paymentFormStore,
  introduceYourselfFormStore,
  personalContributionFormStore,
  bottomSheetStore}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

  const push = async () => {
    if (paymentFormStore.isFormValid()) {
      try {
        const formData = {
          ...introduceYourselfFormStore.getFormFieldsJson(),
          ...personalContributionFormStore.getFormFieldsJson(),
          ...paymentFormStore.getFormFieldsJson(),
        };

        let data = {
          title: `request to join ${currDaoId} by ${userInfo.ethereumAddress}`,
          description: formData.about_me,
          links: formData.links,
          funding: formData.amount * 100,
          preAuthId: false,
        };

        const cardData = {
          encryptedData: 'TODO: pgp this ->',  //JSON.stringify({number: formData.card_number, cvv: formData.cvv}),
          idempotencyKey: '123e4567-e89b-12d3-a456-426614174000',
          billingDetails: {
            name: 'Customer 0002',
            city: 'Test City',
            country: 'United States',
            line1: 'Test',
            postalCode: '11111',
            district: 'MA',
          },
          expMonth: formData.expiration_date.split('/')[0],
          expYear: formData.expiration_date.split('/')[1],
          metadata: {
            email: 'moore@daostack.io',
            sessionId: '1234shouldBeHashed',
            ipAddress: '127.0.0.1',
          },
        };

        const cardCreate = await createCard(cardData, (+data.funding), navigation);
        //console.log('cardCreate', cardCreate);

      /*
        navigation.navigate({name: 'FullScreenCreationLoader', params: {title: 'Creating your membership request', refreshFeed}});

        // Skip mangopay for now, as the service is not responding and we are not using mangopay anyhow
        // if (Number(data.funding) > 0) {
        //   const preAuthId = await preauthorizePayment(cardData, Number(data.funding), navigation);
        //   data = { ...data, preAuthId };
        //   console.log('PREAUTH ID', preAuthId);
        // }

        const proposalId = await ArcService.createRequestToJoin(
          currDaoId,
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

        if (typeof refreshFeed === 'function') {
          refreshFeed();
        }

        navigation.dispatch(navigate);*/
      } catch (e) {
        ////navigation.pop();
        showErrorPopUp(bottomSheetStore, e?.response?.data?.error?.error ? e.response.data.error.error : e.message);
      }
    }
  };

  const subtitle = `You are contributing $${personalContributionFormStore.form.fields.amount?.value} to this common`;

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
          title="Payment"
          currentIndex={4}
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
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: scrollY}}},
          ])}>
          <CreateStepHeader
            isFirstStepSkipped={skipFirstStep}
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
              value={/* __DEV__ ? */ 4007410000000006}
              editable={true}
              validation={{
                name: RequestToJoinForm.FIELD_CARD_NUMBER,
                formStore: paymentFormStore,
                validateRule: 'required|numeric',
              }}
            />

            <TextInputField
              label="Name on card"
              value={/* __DEV__ ? */ 'Tester Tester'}
              editable={true}
              validation={{
                name: RequestToJoinForm.FIELD_CARD_NAME,
                formStore: paymentFormStore,
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
                value={/* __DEV__ ?  */'01/25'}
                placeholderText="MM/YY"
                editable={true}
                validation={{
                  name: RequestToJoinForm.FIELD_EXPIRATION_DATE,
                  formStore: paymentFormStore,
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
                editable={true}
                validation={{
                  name: RequestToJoinForm.FIELD_CVV,
                  formStore: paymentFormStore,
                  validateRule: 'required|numeric|digits_between:3,4',
                }}
              />
            </View>

            <Text
              style={{
                ...text.blackText,color: colors.grey2, textAlign: 'center',
              }}>
              Your money will be refunded if the common does not approve your
              request or meet the funding goal
            </Text>
          </View>
        </ScrollView>
        <RequestStepActionButton
          title="Pay Now"
          pass={paymentFormStore.isFormActionEnabled()}
          onPress={push}
        />
      </SafeAreaView>
    </>
  );
};

RequestStep4.propTypes = {
  navigation: object,
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
    }),
  }),
  userStore: shape({
    userInfo: shape({
      ethereumAddress: string,
    }),
  }),
  paymentFormStore: shape({
    isFormValid: func,
    getFormFieldsJson: func,
    isFormActionEnabled: func,
  }),
  introduceYourselfFormStore: shape({
    getFormFieldsJson: func,
  }),
  personalContributionFormStore: shape({
    getFormFieldsJson: func,
    form: object,
  }),
  bottomSheetStore: object,
};

export default inject(
  'bottomSheetStore',
  'introduceYourselfFormStore',
  'personalContributionFormStore',
  'paymentFormStore',
  'userStore',
)(observer(RequestStep4));
