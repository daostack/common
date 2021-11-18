import React, {useState} from 'react';
import {View, Text, Dimensions, Platform} from 'react-native';
import {bool, func, object, shape, string} from 'prop-types';

import {CommonActions} from '@react-navigation/native';
import RequestStepHeaderTitle from './RequestStepHeaderTitle';
import RequestStepActionButton from '../../RequestStepActionButton';

import * as BillingDetailsConstants from '~/Components/Forms/BillingDetailsForm';
import TextInputField from '~/Components/FormFields/TextInputField';
import {CountrySelectField} from '~/Components/FormFields/CountrySelectField';
import {font} from '../../../../Theme';
import {testCard} from '~/Config';
import {inject} from 'mobx-react';
import {VALIDATION_RULES} from '~/Stores/FormStores/ValidationRules/billingDetailsRules';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import {formatNumber} from '~/Util/FormatUtil';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {authStorePropTypes} from '~/Types/propTypes';
import {PurpleBoxMessage} from '~/Components/PurpleBoxMessage';

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

const BillingDetailsStep = ({navigation, route, authStore}) => {
  const {
    skipFirstStep,
    currCommon,
    currDaoId,
    refreshFeed,
    formStores,
  } = route.params;
  const billingDetailsFormStore = formStores.billingDetailsFormStore;
  const personalContributionFormStore =
    formStores.personalContributionFormStore;
  const {width} = Dimensions.get('window');
  const [country, setCountry] = useState(country);

  const isMonthly = currCommon.metadata.contributionType === 'monthly';

  const getUserFullName = () => {
    const name =
      billingDetailsFormStore.getFormField(BillingDetailsConstants.City)
        ?.value || authStore.userInfo.displayName;

    return new RegExp(/^[a-zA-Z'’. ]*$/).test(name) ? name : '';
  };

  const navigateToPaymentDetailsStep = () => {
    if (billingDetailsFormStore.isFormValid()) {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'PaymentDetailsStep',
          params: {
            formStores,
            currDaoId: currDaoId,
            currCommon: currCommon,
            skipFirstStep: skipFirstStep,
            refreshFeed,
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
      You are contributing ${contributionAmount ? contributionAmount : 0}
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
            name: BillingDetailsConstants.CardName,
            formStore: billingDetailsFormStore,
            validateRule: [
              'required',
              VALIDATION_RULES.LATIN_ONLY,
              VALIDATION_RULES.FIRST_LAST_NAME,
            ],
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
            validateRule: ['required', VALIDATION_RULES.LATIN_ONLY],
            displayName: 'city',
          }}
        />

        <CountrySelectField
          label="Country"
          onChange={(x) => {
            setCountry(x);
          }}
          validation={{
            name: BillingDetailsConstants.Country,
            formStore: billingDetailsFormStore,
            validateRule: 'required|string',
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
                  BillingDetailsConstants.Address,
                )?.value
          }
          autoCapitalize="words"
          autofill={AUTOFILL[Platform.OS].street}
          validation={{
            name: BillingDetailsConstants.Address,
            formStore: billingDetailsFormStore,
            validateRule: 'required|string',
            displayName: 'address',
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
              validateRule: ['required', 'min:2', VALIDATION_RULES.LATIN_ONLY],
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
              validateRule: [
                'required',
                'min:9',
                'max:9',
                VALIDATION_RULES.VALID_ID_PASSPORT,
              ],
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
            validateRule: 'required|string',
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
