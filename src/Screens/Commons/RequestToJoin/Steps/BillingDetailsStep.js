import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, ScrollView, Animated, Dimensions} from 'react-native';
import {bool, func, object, shape, string} from 'prop-types';

import {inject, observer} from 'mobx-react';
import {CommonActions} from '@react-navigation/native';
import CreateStepNavigation from '../RequestStepNavigation';
import CreateStepDotHeader from '../RequestStepDotHeader';
import CreateStepHeader from '../RequestStepHeader';
import RequestStepHeaderTitle from '../RequestStepHeaderTitle';
import RequestStepActionButton from '../../RequestStepActionButton';

import * as BillingDetailsConstants from '../../../../Components/Forms/BillingDetailsForm';
import TextInputField from '../../../../Components/FormFields/TextInputField';
import {CountrySelectField} from '../../../../Components/FormFields/CountrySelectField';
import {font} from '../../../../Theme';
import MembershipRequest from '../MembershipRequest';

const BillingDetailsStep = ({navigation, route, billingDetailsFormStore, personalContributionFormStore}) => {
  const {skipFirstStep, currCommon, currDaoId, refreshFeed} = route.params;
  const {width} = Dimensions.get('window');

  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);

  const [country, setCountry] = useState(country);

  const isMonthly = currCommon.metadata.contribution === 'monthly';

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });

    setHeaderHeight(height);
  }, [scrollY]);

  const navigateToPaymentDetailsStep = () => {
    if (billingDetailsFormStore.isFormValid()) {
      navigation.dispatch(CommonActions.navigate({
        name: 'PaymentDetailsStep',
        params: {
          currDaoId: currDaoId,
          currCommon: currCommon,
          skipFirstStep: skipFirstStep,
          refreshFeed,
        },
      }));
    }
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
      <SafeAreaView style={{backgroundColor: 'white'}} />
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          flex: 1,
        }}
      >
        <CreateStepNavigation
          navigation={navigation}
          title={currCommon.name}
        />

        <CreateStepDotHeader
          title="Billing Details"
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
          onScroll={
            Animated.event([ {
              nativeEvent: {
                contentOffset: {y: scrollY},
              },
            }])
          }
        >
          <MembershipRequest />

          <CreateStepHeader
            isFirstStepSkipped={skipFirstStep}
            currentIndex={3}
          />

          <View
            style={{
              flex: 1,
              width: width * 0.8,
              backgroundColor: 'white',
            }}>
            <RequestStepHeaderTitle title="Billing Details" subtitle={subtitle} />

            <TextInputField
              editable
              label="Full name"
              validation={{
                name: BillingDetailsConstants.FullName,
                formStore: billingDetailsFormStore,
                validateRule: 'required|string',
                displayName: 'full name',
              }}
            />

            <TextInputField
              editable
              label="City"
              validation={{
                name: BillingDetailsConstants.City,
                formStore: billingDetailsFormStore,
                validateRule: 'required|string',
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
              validation={{
                name: BillingDetailsConstants.Address,
                formStore: billingDetailsFormStore,
                validateRule: 'required|string',
                displayName: 'address',
              }}
            />

            {country === 'US' && (
              <TextInputField
                editable
                label="District"
                validation={{
                  name: BillingDetailsConstants.District,
                  formStore: billingDetailsFormStore,
                  validateRule: 'required|string',
                  displayName: 'district',
                }}
              />
            )}

            <TextInputField
              editable
              label="Postal Code"
              validation={{
                name: BillingDetailsConstants.PostalCode,
                formStore: billingDetailsFormStore,
                validateRule: 'required|string',
                displayName: 'postal code',
              }}
            />
          </View>
        </ScrollView>

        <RequestStepActionButton
          title="Continue to payment"
          pass={billingDetailsFormStore.isFormActionEnabled()}
          onPress={navigateToPaymentDetailsStep}
        />
      </SafeAreaView>
    </React.Fragment>
  );
};

BillingDetailsStep.propTypes = {
  navigation: object,
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

export default inject(
  'billingDetailsFormStore',
  'personalContributionFormStore',
)(observer(BillingDetailsStep));
