import React from 'react';
import {Text, View} from 'react-native';
import TextInputField from '~/Components/FormFields/TextInputField';
import MultiTitleValueField from '~/Components/FormFields/MultiTitleValueField';
import {colors, text} from '~/Theme';
import RequestToJoinForm from '~/Components/Forms/RequestToJoinForm';
import RequestStepActionButton from '../../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import RequestStepHeaderTitle from '../RequestStepHeaderTitle';
import MembershipRequest from '../MembershipRequest';
import {string, object, bool, shape, func} from 'prop-types';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';
import {PurpleBoxMessage} from '~/Components/PurpleBoxMessage';
import {calcShouldSkipRules} from '~/Util/rules';
import {PurpleBoxMessage} from '~/Components/PurpleBoxMessage';

const IntroductionStep = ({
  navigation,
  route: {
    params: {formStores, skipFirstStep, currCommon, currDaoId, refreshFeed},
  },
}) => {
  const introduceYourselfFormStore = formStores.introduceYourselfFormStore;

  const push = () => {
    const hasRules = !calcShouldSkipRules(currCommon);
    if (introduceYourselfFormStore.isFormValid()) {
      const navigate = CommonActions.navigate({
        name: hasRules ? 'RulesStep' : 'ContributionStep',
        params: {
          formStores,
          currDaoId: currDaoId,
          currCommon: currCommon,
          skipFirstStep: skipFirstStep,
          refreshFeed,
        },
      });
      navigation.dispatch(navigate);
    }
  };

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Introduce Yourself"
      navTitle={currCommon.name}
      currentIndex={1}
      skipFirstStep={skipFirstStep}
      isRequestToJoin={true}
      layoutTitle={<MembershipRequest />}
      requestStepActionButton={
        <RequestStepActionButton
          title="Continue"
          formStore={introduceYourselfFormStore}
          onPress={push}
        />
      }>
      <View
        style={{
          flex: 1,
          // alignItems: 'center',
          // padding: 24,
          backgroundColor: 'white',
        }}>
        <RequestStepHeaderTitle
          title="Introduce Yourself"
          subtitle="Let the Common members learn more about you and how you relate to the cause."
        />

        <PurpleBoxMessage message="Please note: currently, credit cards issued by Mastercard are not supported." />

        <View
          style={{
            backgroundColor: colors.grey4,
            height: 1,
            marginBottom: 40,
          }}
        />
        <TextInputField
          label="Intro"
          infoLabel="Required"
          placeholderText="Let the Common members learn more about you and how you relate to the cause."
          multiline={true}
          numberOfLines={6}
          validation={{
            name: RequestToJoinForm.FIELD_INTRO,
            formStore: introduceYourselfFormStore,
            validateRule: 'required|string',
          }}
        />

        <Text style={{...text.h3Black, textAlign: 'left'}}>Links</Text>

        <MultiTitleValueField
          link
          value={
            introduceYourselfFormStore.getFormField(
              RequestToJoinForm.FIELD_LINKS,
            )?.value
          }
          allowsEditing={true}
          title="Title"
          maxLength={30}
          validation={{
            name: RequestToJoinForm.FIELD_LINKS,
            formStore: introduceYourselfFormStore,
          }}
        />
      </View>
    </StepDotLayout>
  );
};

IntroductionStep.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      skipFirstStep: bool,
      currDaoId: string,
      refreshFeed: func,
      formStores: object,
    }),
  }),
};

export default IntroductionStep;
