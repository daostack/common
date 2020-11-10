import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated, Image,
} from 'react-native';
import TextInputField from '~/Components/FormFields/TextInputField';
import {colors, layout, text} from '~/Theme';
import {observer, inject} from 'mobx-react';
import CreateStepHeader from '../RequestStepHeader';
import CreateStepNavigation from '../RequestStepNavigation';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import CreateStepDotHeader from '../RequestStepDotHeader';
import RequestStepActionButton from '../../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import ArcService from '~/Services/ArcService';
import RequestStepHeaderTitle from '../RequestStepHeaderTitle';
import {showErrorPopUp} from '~/Util';
import {string, func, bool, object, shape} from 'prop-types';
import {font} from '../../../../Theme';
import MembershipRequest from '../MembershipRequest';
import {createCardPayload} from '../../../../Services/CirclePayService';
import {testCard} from '~/Config';
import moment from 'moment';
import {VALIDATION_RULES} from '~/FormStores/ValidationRules';

const {width} = Dimensions.get('window');

const PaymentDetailsStep = ({
  navigation,
  route: {
    params: {
      skipFirstStep,
      currCommon,
      currDaoId,
      refreshFeed,
    },
  },
  userStore: {userInfo},
  paymentFormStore,
  introduceYourselfFormStore,
  personalContributionFormStore,
  billingDetailsFormStore,
  bottomSheetStore,
}) => {
  const isMonthly = currCommon.metadata.contribution === 'monthly';

  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [expDateFormat, setExpDateFormat] = useState('');

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
          ...billingDetailsFormStore.getFormFieldsJson(),
        };

        const data = {
          title: `request to join ${currDaoId} by ${userInfo.ethereumAddress}`,
          description: formData.about_me,
          links: formData.links,
          funding: formData.amount * 100,
          preAuthId: false,
        };

        navigation.navigate({
          name: 'FullScreenCreationLoader',
          params: {
            title: 'Creating your membership request',
          },
        });

        // Create the proposal
        const proposalId = await ArcService.createRequestToJoin(
          currDaoId, {
            ...data,
            cardData: await createCardPayload({
              ...formData,
              ...userInfo,
            }),
          },
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

        navigation.dispatch(navigate);
      } catch (e) {
        navigation.pop();

        showErrorPopUp(bottomSheetStore, e);
      }
    }
  };

  const formatDate = (date) => {
    date = date.replace('/', '');
    return date.length > 2
      ? `${date.substring(0,2)}/${date.substring(2,4)}`
      : date;
  };

  const subtitle = (style) => (
    <Text style={style}>
      You are contributing ${personalContributionFormStore.form.fields.amount?.value}

      <Text style={{...font.primary.bold}}>
        {' '}({isMonthly ? 'monthly' : 'one time'}){' '}
      </Text>

      to this common
    </Text>
  );

  return (
    <React.Fragment>
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
          title="Payment Details"
          currentIndex={5}
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
          ])}
        >
          <MembershipRequest />

          <CreateStepHeader
            isFirstStepSkipped={skipFirstStep}
            currentIndex={4}
          />

          <View
            style={{
              flex: 1,
              // padding: 24,
              backgroundColor: 'white',
            }}>
            <RequestStepHeaderTitle title="Payment Details" subtitle={subtitle} />
            <TextInputField
              label="Credit card number"
              value={testCard ? '4007410000000006' : ''}
              editable={true}
              keyboardType={'number-pad'}
              validation={{
                name: RequestToJoinForm.FIELD_CARD_NUMBER,
                formStore: paymentFormStore,
                validateRule: [
                  'required',
                  'numeric',
                  VALIDATION_RULES.IS_VALID_CREDIT_CARD,
                  VALIDATION_RULES.CREDIT_CARD_PROVIDER,
                ],
              }}
            />

            <TextInputField
              label="Name on card"
              value={testCard ? 'Tester Tester' : ''}
              editable={true}
              autoCapitalize="words"
              validation={{
                name: RequestToJoinForm.FIELD_CARD_NAME,
                formStore: paymentFormStore,
                validateRule: [
                  'required',
                  VALIDATION_RULES.FIRST_LAST_NAME,
                ],
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
                value={!testCard ? moment().format('MM/YY') : expDateFormat}
                placeholderText="MM/YY"
                editable={true}
                onChangeText={(date) => setExpDateFormat(date)}
                format={(date) => formatDate(date)}
                keyboardType={'number-pad'}
                validation={{
                  name: RequestToJoinForm.FIELD_EXPIRATION_DATE,
                  formStore: paymentFormStore,
                  validateRule: [
                    'required',
                    'string',
                    VALIDATION_RULES.CARD_EXP_DATE,
                  ],
                }}
              />
              <TextInputField
                viewStyle={{
                  width: '45%',
                }}
                label="CVV"
                value={testCard ? '123' : ''}
                keyboardType={'number-pad'}
                editable={true}
                validation={{
                  name: RequestToJoinForm.FIELD_CVV,
                  formStore: paymentFormStore,
                  validateRule: 'required|numeric|digits_between:3,4',
                }}
              />
            </View>

            <View style={styles.circleContainer}>
              <Text
                style={{
                  ...text.regularText,
                  color: colors.grey2,
                  marginBottom: -25,
                }}
              >
                Powered by
              </Text>

              <Image
                resizeMode="contain"
                source={require('../../../../Assets/circle.png')}
                style={{
                  width: width * 0.3,
                }}
              />
            </View>

            <Text
              style={{
                ...text.regularText,
                color: colors.grey2,
                textAlign: 'center',
              }}
            >
              If your membership request will not be accepted, you will not
              be charged. Your card will be saved for the monthly contribution
              of ${personalContributionFormStore.form.fields.amount?.value},
              you can cancel at any time.
            </Text>
          </View>
        </ScrollView>
        <RequestStepActionButton
          title="Pay Now"
          pass={paymentFormStore.isFormActionEnabled()}
          onPress={push}
        />
      </SafeAreaView>
    </React.Fragment>
  );
};

const styles = {
  circleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
};

PaymentDetailsStep.propTypes = {
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
  billingDetailsFormStore: shape({
    getFormFieldsJson: func,
    form: object,
  }),
  bottomSheetStore: object,
};

export default inject(
  'bottomSheetStore',
  'introduceYourselfFormStore',
  'personalContributionFormStore',
  'billingDetailsFormStore',
  'paymentFormStore',
  'userStore',
)(observer(PaymentDetailsStep));
