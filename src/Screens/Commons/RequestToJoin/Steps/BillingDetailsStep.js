import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, Platform} from 'react-native';
import {bool, func, object, shape, string} from 'prop-types';

import {CommonActions} from '@react-navigation/native';
import RequestStepHeaderTitle from '../RequestStepHeaderTitle';
import RequestStepActionButton from '../../RequestStepActionButton';

import * as BillingDetailsConstants from '../../../../Components/Forms/BillingDetailsForm';
import TextInputField from '~/Components/FormFields/TextInputField';
import {CountrySelectField} from '~/Components/FormFields/CountrySelectField';
import {font} from '../../../../Theme';
//import {testCard} from '~/Config';
import {inject} from 'mobx-react';
import {VALIDATION_RULES} from '~/FormStores/ValidationRules/billingDetailsRules';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import {formatNumber} from '~/Util/FormatUtil';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {authStorePropTypes} from '~/Types/propTypes';
import {PurpleBoxMessage} from '~/Components/PurpleBoxMessage';
import {CurrencySymbols} from '~/Util/locale';
import BillingDetailsService from '~/Services/BillingDetailsService';
import PaymentService from '~/Services/PaymentsService';
import Toast from '~/Util/Toast';
import {formInitialState} from '~/Util/constants/form';
const testCard = false;
const AUTOFILL = {
  ios: {
    name: 'name',
    city: 'addressCity',
    street: 'streetAddressLine1',
    postalCode: 'postalCode',
  },
  android: {
    name: 'name',
    city: 'street-address',
    street: 'street-address',
    postalCode: 'postal-code',
  },
};

const FORM_RULES = {
  [BillingDetailsConstants.City]: ['required', VALIDATION_RULES.LATIN_ONLY],
  [BillingDetailsConstants.Name]: [
    'required',
    VALIDATION_RULES.LATIN_ONLY,
    VALIDATION_RULES.FIRST_LAST_NAME,
  ],
  [BillingDetailsConstants.PostalCode]: [
    'required',
    VALIDATION_RULES.POSTAL_CODE,
  ],
  [BillingDetailsConstants.Country]: 'required|string',
  [BillingDetailsConstants.Line1]: 'required|string',
  [BillingDetailsConstants.PostalCode]: 'required|string',
  [BillingDetailsConstants.District]: [
    'required',
    'min:2',
    VALIDATION_RULES.LATIN_ONLY,
  ],
  [BillingDetailsConstants.ID]: [
    'required',
    'min:9',
    'max:9',
    VALIDATION_RULES.VALID_ID_PASSPORT,
  ],
};

const BillingDetailsStep = ({navigation, route, authStore}) => {
  const {skipFirstStep, currCommon, currDaoId, refreshFeed, formStores} =
    route.params;
  const billingDetailsFormStore = formStores.billingDetailsFormStore;
  const personalContributionFormStore =
    formStores.personalContributionFormStore;
  const {width} = Dimensions.get('window');
  const [country, setCountry] = useState(country);
  const [billingDetailsExist, setBillingDetailsExist] = useState(false);

  const isMonthly = currCommon.metadata.contributionType === 'monthly';

  const getUserFullName = () => {
    const name =
      billingDetailsFormStore.getFormField(BillingDetailsConstants.Name)
        ?.value || authStore.userInfo.displayName;

    return new RegExp(/^[a-zA-Z'’. ]*$/).test(name) ? name : '';
  };

  useEffect(() => {
    (async () => {
      const {data} = await BillingDetailsService.getBillingDetails();
      if (data) {
        setBillingDetailsExist(true);
      }
      setCountry(data.country.toString().toUpperCase());
      billingDetailsFormStore.initFormStoreState({
        [BillingDetailsConstants.City]: {
          ...formInitialState,
          rule: FORM_RULES[BillingDetailsConstants.City],
          value: data.city,
        },
        [BillingDetailsConstants.Name]: {
          ...formInitialState,
          rule: FORM_RULES[BillingDetailsConstants.Name],
          value: data.name,
        },
        [BillingDetailsConstants.Country]: {
          ...formInitialState,
          rule: FORM_RULES[BillingDetailsConstants.Country],
          value: data.country.toString().toUpperCase(),
        },
        [BillingDetailsConstants.Line1]: {
          ...formInitialState,
          rule: FORM_RULES[BillingDetailsConstants.Line1],
          value: data.line1,
        },
        [BillingDetailsConstants.PostalCode]: {
          ...formInitialState,
          rule: FORM_RULES[BillingDetailsConstants.PostalCode],
          value: data.postalCode,
        },
        [BillingDetailsConstants.District]: {
          ...formInitialState,
          rule: FORM_RULES[BillingDetailsConstants.District],
          value: data.district,
        },
      });
    })();
  }, []);

  const navigateToPaymentDetailsStep = async () => {

    Toast.loading('One moment please');

     if (!billingDetailsExist) {
       await BillingDetailsService.addBillingDetails(
         billingDetailsFormStore.getFormFieldsJson(),
       );
     }

    if (billingDetailsFormStore.isFormValid()) {
      const {data} = await PaymentService.createBuyerTokenPage(
        authStore.userInfo.uid,
      );
      navigation.dispatch(
        CommonActions.navigate({
          name: 'PaymentDetailsStep',
          params: {
            formStores,
            currDaoId: currDaoId,
            currCommon: currCommon,
            skipFirstStep: skipFirstStep,
            refreshFeed,
            iFrameLink: data.link,
          },
        }),
      );
    }
  };

  const contributionAmount = formatNumber(
    personalContributionFormStore.getFormField(RequestToJoinForm.FIELD_AMOUNT)
      ?.value?.value,
  );

  const subtitle = (style) => (
    <Text style={style}>
      You are contributing {CurrencySymbols.SHEKEL}
      {contributionAmount ? contributionAmount : 0}
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
      stepDotHeaderTitle="Billing Details"
      navTitle={currCommon.name}
      currentIndex={4}
      isRequestToJoin={true}
      requestStepActionButton={
        <RequestStepActionButton
          title="Continue to payment"
          formStore={billingDetailsFormStore}
          onPress={navigateToPaymentDetailsStep}
        />
      }>
      <View
        style={{
          flex: 1,
          width: width * 0.8,
          backgroundColor: 'white',
        }}>
        <RequestStepHeaderTitle title="Billing Details" subtitle={subtitle} />

        <PurpleBoxMessage message="Please note: currently, credit cards issued by Mastercard are not supported." />

        <TextInputField
          editable
          label="Name on Card"
          value={testCard ? 'Thor Odinson' : getUserFullName()}
          autoCapitalize="words"
          autofill={AUTOFILL[Platform.OS].name}
          validation={{
            name: BillingDetailsConstants.Name,
            formStore: billingDetailsFormStore,
            validateRule: FORM_RULES[BillingDetailsConstants.Name],
            displayName: 'full name',
          }}
        />

        <TextInputField
          editable
          label="City"
          value={
            testCard
              ? 'Metropolis'
              : billingDetailsFormStore.getFormField(
                  BillingDetailsConstants.City,
                )?.value
          }
          autoCapitalize="words"
          autofill={AUTOFILL[Platform.OS].city}
          validation={{
            name: BillingDetailsConstants.City,
            formStore: billingDetailsFormStore,
            validateRule: FORM_RULES[BillingDetailsConstants.City],
            displayName: 'city',
          }}
        />

        <CountrySelectField
          value={country}
          label="Country"
          onChange={(x) => {
            setCountry(x);
          }}
          validation={{
            name: BillingDetailsConstants.Country,
            formStore: billingDetailsFormStore,
            validateRule: FORM_RULES[BillingDetailsConstants.Country],
            displayName: 'country',
          }}
        />

        <TextInputField
          editable
          label="Address"
          value={
            testCard
              ? '221B Baker Street'
              : billingDetailsFormStore.getFormField(
                  BillingDetailsConstants.Line1,
                )?.value
          }
          autoCapitalize="words"
          autofill={AUTOFILL[Platform.OS].street}
          validation={{
            name: BillingDetailsConstants.Line1,
            formStore: billingDetailsFormStore,
            validateRule: FORM_RULES[BillingDetailsConstants.Line1],
            displayName: 'line1',
          }}
        />

        {(country === 'US' || country === 'CA') && (
          <TextInputField
            editable
            label="District"
            maxLength={2}
            autoCapitalize="characters"
            value={
              testCard
                ? 'TX'
                : billingDetailsFormStore.getFormField(
                    BillingDetailsConstants.District,
                  )?.value
            }
            validation={{
              name: BillingDetailsConstants.District,
              formStore: billingDetailsFormStore,
              validateRule: FORM_RULES[BillingDetailsConstants.District],
              displayName: 'district',
            }}
          />
        )}

        {country === 'IL' && (
          <TextInputField
            editable
            label="National ID/Passport Number"
            maxLength={9}
            autoCapitalize="characters"
            value={
              testCard
                ? '012345678'
                : billingDetailsFormStore.getFormField(
                    BillingDetailsConstants.ID,
                  )?.value
            }
            validation={{
              name: BillingDetailsConstants.ID,
              formStore: billingDetailsFormStore,
              validateRule: FORM_RULES[BillingDetailsConstants.ID],
            }}
          />
        )}

        <TextInputField
          editable
          label="Postal Code"
          autofill={AUTOFILL[Platform.OS].postalCode}
          value={
            testCard
              ? '31415PI'
              : billingDetailsFormStore.getFormField(
                  BillingDetailsConstants.PostalCode,
                )?.value
          }
          validation={{
            name: BillingDetailsConstants.PostalCode,
            formStore: billingDetailsFormStore,
            validateRule: FORM_RULES[BillingDetailsConstants.PostalCode],
            displayName: 'postal code',
          }}
        />
      </View>
    </StepDotLayout>
  );
};

BillingDetailsStep.propTypes = {
  navigation: object,
  authStore: authStorePropTypes,
  route: shape({
    params: shape({
      skipFirstStep: bool,
      currDaoId: string,
      refreshFeed: func,
    }),
  }),
  personalContributionFormStore: shape({
    getFormFieldsJson: func,
    form: object,
  }),
  billingDetailsFormStore: shape({
    fieldChanged: func,
    isFormValid: func,
  }),
};

export default inject('authStore')(BillingDetailsStep);
