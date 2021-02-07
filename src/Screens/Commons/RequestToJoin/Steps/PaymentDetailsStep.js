import React from 'react';
import {Text, View, Dimensions, Image, Platform} from 'react-native';
import TextInputField from '~/Components/FormFields/TextInputField';
import {colors, layout, text} from '~/Theme';
import {inject} from 'mobx-react';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import RequestStepActionButton from '../../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import RequestStepHeaderTitle from '../RequestStepHeaderTitle';
import {showErrorPopUp} from '~/Util';
import {string, func, bool, object, shape} from 'prop-types';
import {font} from '../../../../Theme';
import MembershipRequest from '../MembershipRequest';
import {createCard} from '../../../../Services/CirclePayService';
import ProposalService from '~/Services/ProposalService';
import {testCard} from '~/Config';
import moment from 'moment';
import {VALIDATION_RULES} from '~/FormStores/ValidationRules/paymentDetailsRules';
import {formatNumber} from '~/Util/FormatUtil';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';

const {width} = Dimensions.get('window');

const PaymentDetailsStep = ({
  navigation,
  route: {
    params: {formStores, skipFirstStep, currCommon, currDaoId, refreshFeed},
  },
  userStore: {userInfo},
  bottomSheetStore,
}) => {
  const isMonthly = currCommon.metadata.contributionType === 'monthly';

  const paymentFormStore = formStores.paymentFormStore;
  const introduceYourselfFormStore = formStores.introduceYourselfFormStore;
  const personalContributionFormStore =
    formStores.personalContributionFormStore;
  const billingDetailsFormStore = formStores.billingDetailsFormStore;

  const escapeUrl = (linkArr) =>
    // eslint-disable-next-line no-return-assign
    linkArr.map((link) =>
        link.value = link.value.replace('[', '%5B').replace(']', '%5D')
     );

  const push = async () => {
    if (paymentFormStore.isFormValid()) {
      try {
        const formData = {
          ...introduceYourselfFormStore.getFormFieldsJson(),
          ...personalContributionFormStore.getFormFieldsJson(),
          ...paymentFormStore.getFormFieldsJson(),
          ...billingDetailsFormStore.getFormFieldsJson(),
        };

        //escapeUrl(formData.links);

        const data = {
          description: formData.intro,
          funding: formData.amount * 100,
          commonId: currDaoId,
        };

        if (formData.links) {
          data.links = formData.links;
        }

        navigation.navigate({
          name: 'FullScreenCreationLoader',
          params: {
            title: 'Creating your membership request',
          },
        });

        const createdCard = await createCard({
          ...formData,
          ...userInfo,
        });

        const createRequestToJoinResponse = await ProposalService.getInstance().createRequestToJoin(
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

        bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.BACKEND_ERROR, {
          subTitle: "We couldn't create your proposal",
          error: e,
        });
      }
    }
  };

  const formatDate = (date) => {
    date = date.replace('/', '');
    return date.length > 2
      ? `${date.substring(0, 2)}/${date.substring(2, 4)}`
      : date;
  };

  const subtitle = (style) => (
    <Text style={style}>
      You are contributing $
      {formatNumber(
        personalContributionFormStore.getFormField(
          RequestToJoinForm.FIELD_AMOUNT,
        )?.value?.value,
      )}
      <Text style={{...font.primary.bold}}>
        {' '}
        ({isMonthly ? 'monthly' : 'one time'}){' '}
      </Text>
      to this common
    </Text>
  );

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Payment Details"
      navTitle={currCommon.name}
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

        <Text
          style={{
            ...text.regularText,
            color: colors.grey2,
            textAlign: 'center',
          }}>
          If your membership request will not be accepted, you will not be
          charged. Your card will be saved for the monthly contribution of $
          {
            personalContributionFormStore.getFormField(
              RequestToJoinForm.FIELD_AMOUNT,
            )?.value?.value
          }
          , you can cancel at any time.
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

export default inject('bottomSheetStore', 'userStore')(PaymentDetailsStep);
