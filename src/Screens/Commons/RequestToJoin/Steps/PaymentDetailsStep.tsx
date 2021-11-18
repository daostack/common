import React from 'react';
import {Text, View, Dimensions, Image, Platform, TextStyle} from 'react-native';
import {useNavigation, useRoute, StackActions} from '@react-navigation/core';
import TextInputField from '~/Components/FormFields/TextInputField';
import {colors, layout, text} from '~/Theme';
import {inject} from 'mobx-react';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import RequestStepActionButton from '../../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import RequestStepHeaderTitle from './RequestStepHeaderTitle';
import {showErrorPopUp} from '~/Util';
import {string, func, bool, object, shape} from 'prop-types';
import {font} from '../../../../Theme';
import MembershipRequest from '../MembershipRequest';
import CirclePayService from '~/Services/CirclePayService';
import ProposalService from '~/Services/ProposalService';
import {testCard} from '~/Config';
import moment from 'moment';
import {VALIDATION_RULES} from '~/Stores/FormStores/ValidationRules/paymentDetailsRules';
import {formatNumber} from '~/Util/FormatUtil';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {BOTTOM_SHEET} from '~/Screens/BottomSheetScreens';
import {rootStorePropTypes} from '~/Types/propTypes';

import {escapeUrl} from '~/Util';
import {useStore} from '~/Stores';
import {Common} from '~/Stores/Models';
const {width} = Dimensions.get('window');

export type PaymentDetailsStepRouteProps = {
  params: {
    skipFirstStep: boolean;
    common: Common;
    currDaoId: string;
    refreshFeed(): void;
  };
  key: string;
  name: string;
};

const PaymentDetailsStep = () => {
  const {
    params: {skipFirstStep, common, currDaoId, refreshFeed},
  } = useRoute<PaymentDetailsStepRouteProps>();

  const navigation = useNavigation();
  const {
    uiStore: {bottomSheetStore},
    formStores,
  } = useStore();
  const push = async () => {
    if (!billingDetailsFormStore.isFormValid()) {
      navigation.dispatch(StackActions.pop());
    } else if (paymentFormStore.isFormValid()) {
      try {
        const formData = {
          ...introduceYourselfFormStore.getFormFieldsJson(),
          ...personalContributionFormStore.getFormFieldsJson(),
          ...paymentFormStore.getFormFieldsJson(),
          ...billingDetailsFormStore.getFormFieldsJson(),
        };

        const data = {
          description: formData.intro,
          funding: formData.amount * 100,
          commonId: currDaoId,
          ...(formData.links && {links: escapeUrl(formData.links)}),
        };

        navigation.navigate({
          name: 'FullScreenCreationLoader',
          params: {
            title: 'Creating your membership request',
          },
        });

        const createdCard = await CirclePayService.createCard({
          ...formData,
          links: escapeUrl(formData.links),
          ...userInfo,
        });

        const createRequestToJoinResponse = await ProposalService.createRequestToJoin(
          {
            ...data,
            cardId: createdCard.id,
          },
        );

        if (createRequestToJoinResponse.status === 200) {
          const proposalId = createRequestToJoinResponse.data.id;

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
        } else {
          navigation.pop();
          showErrorPopUp(bottomSheetStore, createRequestToJoinResponse);
        }
      } catch (e) {
        navigation.pop();

        bottomSheetStore.showBottomSheet(BOTTOM_SHEET.BACKEND_ERROR, {
          subTitle: "We couldn't create your proposal",
          error: e,
        });
      }
    }
  };

  const formatDate = (date: string) => {
    date = date.replace('/', '');
    return date.length > 2
      ? `${date.substring(0, 2)}/${date.substring(2, 4)}`
      : date;
  };

  const subtitle = (style: TextStyle) => (
    <Text style={style}>
      You are contributing $
      {formatNumber(
        personalContributionFormStore.getFormField(
          RequestToJoinForm.FIELD_AMOUNT,
        )?.value?.value,
      )}
      <Text style={{...font.primary.bold}}>
        ({` ${common.isMonthly ? 'monthly' : 'one time'} `})
      </Text>
      to this Common
    </Text>
  );

  return (
    <StepDotLayout
      stepDotHeaderTitle="Payment Details"
      navTitle={common.name}
      currentIndex={5}
      skipFirstStep={skipFirstStep}
      isRequestToJoin={true}
      layoutTitle={<MembershipRequest />}
      requestStepActionButton={
        <RequestStepActionButton
          title="Pay Now"
          formStore={paymentFormStore}
          onPress={push}
        />
      }>
      <View
        style={{
          flex: 1,
          // padding: 24,
          backgroundColor: 'white',
        }}>
        <RequestStepHeaderTitle title="Payment Details" subtitle={subtitle} />
        <TextInputField
          label="Credit card number"
          autofill={Platform.OS === 'ios' ? 'creditCardNumber' : 'cc-number'}
          value={
            testCard
              ? '4007410000000006'
              : paymentFormStore.getFormField(
                  RequestToJoinForm.FIELD_CARD_NUMBER,
                )?.value
          }
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
            value={
              testCard
                ? moment().format('MM/YY')
                : paymentFormStore.getFormField(
                    RequestToJoinForm.FIELD_EXPIRATION_DATE,
                  )?.value
            }
            placeholderText="MM / YY"
            editable={true}
            format={(date) => formatDate(date)}
            keyboardType={'number-pad'}
            validation={{
              name: RequestToJoinForm.FIELD_EXPIRATION_DATE,
              formStore: paymentFormStore,
              validateRule: [
                'required',
                VALIDATION_RULES.VALID_DATE_FORMAT,
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
            }}>
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

        <Text style={styles.monthlyBottomMessage}>
          If your membership request will not be accepted, you will not be
          charged.
          {common.isMonthly &&
            `Your card will be saved for the monthly contribution of ${
              personalContributionFormStore.getFormField(
                RequestToJoinForm.FIELD_AMOUNT,
              )?.value?.value
            }, you can cancel at any time.`}
        </Text>
      </View>
    </StepDotLayout>
  );
};

const styles = {
  circleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  monthlyBottomMessage: {
    ...text.regularText,
    color: colors.grey2,
    textAlign: 'center',
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
  rootStore: rootStorePropTypes,
};

export default inject('rootStore')(PaymentDetailsStep);
